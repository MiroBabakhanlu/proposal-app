import React, { useState } from 'react';
import { validateReview } from '../../../utils/validation';
import ValidatedInput from '../../common/ValidatedInput';

const ReviewForm = ({ proposal, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = (data) => {
    const result = validateReview(data);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleRatingChange = (value) => {
    const updatedData = { ...formData, rating: value };
    setFormData(updatedData);
    setTouched({ ...touched, rating: true });
    validateForm(updatedData);
  };

  const handleCommentChange = (e) => {
    const { value } = e.target;
    const updatedData = { ...formData, comment: value };
    setFormData(updatedData);
    validateForm(updatedData);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateForm(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validateForm(formData);
    setTouched({ rating: true, comment: true });

    if (!isValid) return;

    onSubmit(proposal.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">
            {formData.rating}/5
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingChange(value)}
              className={`w-10 h-10 rounded-full transition-colors ${
                formData.rating >= value
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        
        {touched.rating && errors.rating && (
          <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
        )}
      </div>

      <ValidatedInput
        type="textarea"
        name="comment"
        label="Comment (optional)"
        value={formData.comment}
        onChange={handleCommentChange}
        onBlur={handleBlur}
        error={errors.comment}
        touched={touched.comment}
        maxLength={1000}
        rows={4}
        placeholder="Share your thoughts about this proposal..."
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;