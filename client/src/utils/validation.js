

// made this for simple validation througout the app in front (often,  if needed i used validated inputs which just helped me make inpust fast and secure)

// Proposal validation
export const validateProposal = (data) => {
  const errors = {};

  // Title validation
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.trim().length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  // Tags validation (optional)
  if (data.tags && data.tags.length > 0) {
    const invalidTags = data.tags.filter(tag => tag.length > 50);
    if (invalidTags.length > 0) {
      errors.tags = 'Each tag must be less than 50 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Review validation
export const validateReview = (data) => {
  const errors = {};

  // Rating validation
  if (!data.rating) {
    errors.rating = 'Rating is required';
  } else if (data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  // Comment validation (optional)
  if (data.comment && data.comment.trim().length > 1000) {
    errors.comment = 'Comment cannot exceed 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login validation
export const validateLogin = (data) => {
  const errors = {};

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Registration validation
export const validateRegister = (data) => {
  const errors = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(data.password)) {
    errors.password = 'Password must contain at least one letter and one number';
  }

  // Role validation
  if (data.role && !['SPEAKER', 'REVIEWER', 'ADMIN'].includes(data.role)) {
    errors.role = 'Please select a valid role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Status update validation
export const validateStatus = (status) => {
  const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
  return validStatuses.includes(status);
};

// File validation
export const validateFile = (file) => {
  const errors = {};

  if (!file) return { isValid: true, errors: {} };

  // Check file type
  if (file.type !== 'application/pdf') {
    errors.file = 'Only PDF files are allowed';
  }

  // Check file size (4MB)
  if (file.size > 4 * 1024 * 1024) {
    errors.file = 'File size must be less than 4MB';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};