# Omni - Responsive Layout Tester & Accessibility Tool

Omni is a responsive layout testing tool that helps developers and designers create, test, and validate responsive layouts across different device sizes. It combines real-time preview capabilities with accessibility checking to ensure your layouts are both responsive and accessible.

## Core Features

### 🎯 Responsive Testing
- **Multi-device Preview**: Test layouts across mobile (375px), tablet (768px), and desktop (1440px) breakpoints
- **One-click Device Switching**: Instantly switch between device sizes to validate responsive behavior
- **Live Preview**: See your changes in real-time across all device sizes

### ♿ Accessibility Testing
- **WCAG Compliance**: Built-in checks for accessibility standards
- **Touch Target Validation**: Ensure interactive elements meet minimum size requirements
- **Font Scaling**: Test text readability across different viewport sizes
- **Color Contrast**: Validate color combinations for accessibility

### 🎨 Layout Building
- **Drag-and-Drop Interface**: Intuitive grid builder for creating layout mockups
- **Element Library**: Pre-built components (containers, text, images, buttons)
- **Real-time Styling**: Instant property updates and style modifications
- **Responsive Controls**: Fine-tune layout behavior across breakpoints

### 📦 Export & Integration
- **CSS Export**: Generate responsive CSS with Tailwind utilities or custom media queries
- **Code Generation**: Export clean, production-ready code
- **Component Reuse**: Save and reuse layout components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI primitives with Tailwind CSS
- **State Management**: React Hooks
- **Drag and Drop**: React DnD
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ahmadrafidev/omni
cd omni
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Use Cases

1. **Design Validation**: Test responsive layouts before implementation
2. **Accessibility Auditing**: Ensure WCAG compliance across breakpoints
3. **Rapid Prototyping**: Quickly create and test layout concepts
4. **Team Collaboration**: Share and review responsive designs
5. **Code Generation**: Export production-ready responsive CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. We're particularly interested in:
- Additional accessibility checks
- New device breakpoints
- Enhanced export options

## License

This project is licensed under the MIT License - see the LICENSE file for details.
