# Contributing to Cheese & Click

Thank you for your interest in contributing to Cheese & Click! This document provides guidelines and information for contributors.

## Code Style

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add JSDoc comments for components and functions
- Use ESLint and Prettier for code formatting

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings to functions and classes
- Keep functions focused and small

## Component Structure

### React Components
```javascript
/**
 * Component Description
 * @param {Object} props
 * @param {string} props.propName - Description
 */
function ComponentName({ propName }) {
  // Component logic
  return (
    // JSX
  )
}

export default ComponentName
```

### Python Functions
```python
def function_name(param: str) -> dict:
    """
    Function description
    
    Args:
        param: Parameter description
        
    Returns:
        dict: Return description
    """
    # Function logic
    return {}
```

## Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create a pull request

## Testing

- Test all user flows
- Test on multiple browsers
- Test responsive design on different screen sizes
- Verify camera functionality
- Test error handling

## Documentation

- Update README.md for user-facing changes
- Update code comments for complex logic
- Document API changes
- Update installation guide if needed

## Questions?

Feel free to open an issue for questions or clarifications.
