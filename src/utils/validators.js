// src/utils/validators.js

export function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  
  export function validatePassword(password) {
    return password && password.length >= 6;
  }
  
  export function validateTitle(title) {
    return title && title.trim().length > 0;
  }
  
  export function validateDate(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return !isNaN(date.getTime()) && date > now;
  }
  
  export function validateLocation(location) {
    return location && location.trim().length > 0;
  }
  