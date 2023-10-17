[![NPM version][npm-image]][npm-url] [![Downloads][npm-downloads-image]][npm-url]

# Usage

Until Salesforce integrates Node library support, the easiest way to use library components is just to copy them directly.  
  
This can be done easily with the following command:
```bash
npx lwc-library <component-name> <destination-path>
```
  
This copies over the component **along with required shared components**.

## List of Required Components
- `stylesShared` (required)
  
Use `--all` or `-a` option to copy over all components:
```bash
npx lwc-library --all <destination-path>
```

Use `--ignore` or `-i` to ignore shared components.  
```bash
npx lwc-library --ignore -c accordion (copy just the accordion - this will break!)
```


## All Options
- `--component` or `-c` to specify a component
- `--target` or `-t` to specify a destination path
- `--all` or `-a` to copy all components
- `--ignore` or `-i` to ignore shared components
- `--help` or `-h` to see all options

---

# Contribution Guidelines

The main purpose of this library is to simplify components, ensure they are fully accessible, have a singular purpose. They are meant to be **extensible** rather than covering all use cases.  

## Install
Trying out bun.
```bash
bun install
```  

This package is a major work-in-progress, but here is a general guide that outlines questions to ask:

## New Component Recipe

- Accessibility First
  - What will never change about the component?
  - What are the required structure and semantic tags?
  - What are the required ARIA attributes?
- Functionality
  - What is the components singular purpose?
  - What is the structural layout? Are multiple <template>s needed?
  - What are the functional variants?
  - Are there slots?
  - Does it make sense to abstract any logic or use a utility?
- Application & Data
  - How does it react to a larger application and data?
  - What datasources does it subscribe to?
- Style Base and Classes
  - What is the most basic / generic / opinionated style?
  - What are some binary customization options (CSS Classes)?
- Style Customization
  - What are the ::part(s) to be defined?
  - What are the most obvious CSS Variables to add custom style?

## CSS Variable Naming Conventions (WIP)
### Theme-Level
Use single dashes for theme-level variables. These are variables that are used across the entire application. They are the base truth for the application.
  
Three Examples:  
- `primary-color`
- `secondary-color`
- `background-color`

### Component-Level
Use BEM for component-level variables. These are variables that are used within a component. They read defaults from the theme-level variables (typically in a `themeable.css` file).
  
Three Examples:  
- `button__primary-color`
- `button__secondary-color`
- `button__background-color`
