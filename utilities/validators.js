import mongoose from 'mongoose';
import ApiError from './ApiError.js';

/**
 * @param {Model} Model
 * @param {ObjectId} id
 * @param {string} entityName
*/

export const validateDocumentExists = async (Model, id, entityName = 'Document') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${entityName} ID format`, 400);
  }
  
  const exists = await Model.findById(id);
  if (!exists) {
    throw new ApiError(`${entityName} not found`, 404);
  }
  
  return exists;
};

/**
 * @param {Model} Model
 * @param {Array<ObjectId>} ids
 * @param {string} entityName
 */

export const validateDocumentsExist = async (Model, ids, entityName = 'Documents') => {
  const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid ${entityName} ID format: ${invalidIds.join(', ')}`, 400);
  }
  
  const documents = await Model.find({ _id: { $in: ids } });
  
  if (documents.length !== ids.length) {
    const foundIds = documents.map(doc => doc._id.toString());
    const missingIds = ids.filter(id => !foundIds.includes(id.toString()));
    throw new ApiError(`${entityName} not found: ${missingIds.join(', ')}`, 404);
  }
  
  return documents;
};