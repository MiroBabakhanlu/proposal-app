import React, { useState, useEffect } from 'react';
import { useCreateProposal } from '../../../hooks/useProposals';
import { getTags, createTag } from '../../../services/api';
import { validateProposal } from '../../../utils/validation';
import ValidatedInput from '../../common/ValidatedInput';
import FileUpload from '../../common/FileUpload';

const NewProposalForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    file: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProposal = useCreateProposal();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await getTags();
        setAvailableTags(data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);

  const validateForm = (data) => {
    const result = validateProposal(data);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    validateForm(updatedData);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateForm(formData);
  };

  const handleFileChange = (file) => {
    setFormData({ ...formData, file });
    if (errors.file) {
      setErrors({ ...errors, file: undefined });
    }
  };

  const handleFileError = (field, errorMsg) => {
    if (errorMsg) {
      setErrors({ ...errors, [field]: errorMsg });
    } else {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleTagToggle = (tag) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag];

    setFormData({ ...formData, tags: newTags });
    validateForm({ ...formData, tags: newTags });
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;

    if (newTag.trim().length > 50) {
      setErrors({ ...errors, tags: 'Tag name too long (max 50 chars)' });
      return;
    }

    try {
      const { data } = await createTag(newTag);
      if (!availableTags.find(t => t.id === data.id)) {
        setAvailableTags([...availableTags, data]);
      }
      const newTags = [...formData.tags, data.name];
      setFormData({ ...formData, tags: newTags });
      setNewTag('');
      validateForm({ ...formData, tags: newTags });

      if (errors.tags) {
        const { tags, ...rest } = errors;
        setErrors(rest);
      }
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  const handleTagBlur = () => {
    setTouched({ ...touched, tags: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm(formData);
    setTouched({ title: true, description: true, tags: true });

    if (errors.file) {
      alert(`Cannot submit: ${errors.file}`);
      return;
    }

    if (!isValid) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await createProposal.mutateAsync(formDataToSend);

      // reset 
      setFormData({ title: '', description: '', tags: [], file: null });
      setErrors({});
      setTouched({});
      onSuccess();
    } catch (err) {
      console.error('Failed to create proposal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ValidatedInput
        type="text"
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        required
        maxLength={200}
        placeholder="Enter proposal title"
      />

      <ValidatedInput
        type="textarea"
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        required
        maxLength={1000}
        rows={4}
        placeholder="Describe your talk proposal..."
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tags</label>

        <div className="flex flex-wrap gap-2 mb-3">
          {availableTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.name)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.tags.includes(tag.name)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <ValidatedInput
            type="text"
            name="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={handleTagBlur}
            error={errors.tags}
            touched={touched.tags}
            maxLength={50}
            placeholder="New tag name"
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleCreateTag}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Add Tag
          </button>
        </div>
      </div>

      <FileUpload
        onFileChange={handleFileChange}
        error={errors.file}
        onError={handleFileError}
        resetSignal={isSubmitting === false && formData.file === null}
      />

      <button
        type="submit"
        disabled={isSubmitting || createProposal.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || createProposal.isPending ? 'Submitting...' : 'Submit Proposal'}
      </button>
    </form>
  );
};

export default NewProposalForm;