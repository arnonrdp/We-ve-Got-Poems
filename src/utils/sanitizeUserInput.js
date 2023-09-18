const xss = require('xss')

// Sanitization function for the 'content' field
const sanitizeContent = (value) => {
  // Use 'xss' library to escape HTML and avoid malicious scripts
  return xss(value, {
    // Use the following options to allow specific tags and attributes
    whiteList: {}, // Empty, means no tags are allowed
    stripIgnoreTag: true // Filter out all HTML not in the whitelist
  })
}

module.exports = sanitizeContent
