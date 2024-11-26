const cloudinary = require("../config/cloudinary");

const { messages, codes, filetype } = require("../constants/constant");

const { createError, sendErrorResponse } = require("../helper/eventHelper");
const streamifier = require("streamifier");

const {
  getEventFromDB,
  getEventByIdFromDB,
  createEventInDB,
  updateEventInDB,
  getEventByLocationDB,
  deleteEventFromDB,
} = require("../model/eventModel");

const getEvents = async (req, res) => {
  try {
    const eventData = await getEventFromDB();
    if (!eventData.length) {
      throw createError(messages.EVENT_NOT_FOUND, codes.NOT_FOUND);
    }
    res.status(codes.SUCCESS).json(eventData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw createError(messages.INVAILD_ID, codes.BAD_REQUEST);
    }
    const eventData = await getEventByIdFromDB(id);
    if (!eventData.length) {
      throw createError(messages.EVENT_NOT_FOUND_ID, codes.NOT_FOUND);
    }
    res.status(codes.SUCCESS).json(eventData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getEventByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const eventData = await getEventByLocationDB(location);

    if (!eventData.length) {
      throw createError(messages.EVENT_NOT_FOUND_LOCATION, codes.NOT_FOUND);
    }
    res.status(codes.SUCCESS).json(eventData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      email,
      start_date_time,
      end_date_time,
      city,
      venue,
    } = req.body;

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { format: filetype.FILEJPG || filetype.FILEPNG },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                createError(messages.INVAILD_EXTENSION, codes.BAD_REQUEST)
              );
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
      });
    };

    const image_path = await uploadFromBuffer();

    const eventData = await createEventInDB(
      name,
      description,
      email,
      start_date_time,
      end_date_time,
      city,
      venue,
      image_path.url.substring(49)
    );

    if (!eventData) {
      throw createError(messages.ERROR_INSERTION, 400);
    }

    res.status(codes.CREATED).json({
      message: messages.EVENT_CREATED,
      image_url: image_path.url,
    });
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).send({
        message: messages.DUPLICATE_ENTRY,
      });
    }
    sendErrorResponse(res, error);
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw createError(messages.INVAILD_ID, codes.BAD_REQUEST);
    }
    const {
      name,
      description,
      email,
      start_date_time,
      end_date_time,
      city,
      venue,
    } = req.body;

    const eventData = await updateEventInDB(
      name,
      description,
      email,
      start_date_time,
      end_date_time,
      city,
      venue,
      id
    );

    if (eventData.affectedRows > 0) {
      res.status(codes.SUCCESS).send({ message: messages.EVENT_UPDATED });
    } else {
      throw createError(messages.EVENT_NOT_FOUND, codes.NOT_FOUND);
    }
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).send({
        message: messages.DUPLICATE_ENTRY,
      });
    }
    sendErrorResponse(res, error);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw createError(messages.INVAILD_ID, codes.BAD_REQUEST);
    }

    const dataExits = await getEventByIdFromDB(id);
    if (!dataExits.length) {
      throw createError(messages.EVENT_NOT_FOUND, codes.NOT_FOUND);
    }

    const eventData = await deleteEventFromDB(id);

    if (eventData.affectedRows > 0) {
      res.status(codes.SUCCESS).send({ message: messages.EVENT_DELETED });
    } else {
      throw createError(messages.EVENT_NOT_FOUND, codes.NOT_FOUND);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  getEventByLocation,
  createEvent,
  updateEvent,
  deleteEvent,
};
