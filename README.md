# Document Management System

A modern, responsive document management system built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This frontend application helps users organize, view, search, and manage various types of documents including PDFs, images, videos, audio files, and spreadsheets.

## 🚀 Features

### Core Functionality
- **Document Listing**: Display documents with name, description, type, and metadata
- **Search & Filter**: Real-time search across document names, descriptions, and types  
- **Document Viewing**: Built-in viewers for different file types:
  - 📄 PDF files (with external link option)
  - 🖼️ Images (inline preview)
  - 🎥 Videos (HTML5 video player)
  - 🎵 Audio files (HTML5 audio player)
  - 📊 Spreadsheets (download option)
- **Document Management**: Delete documents with confirmation
- **Statistics Dashboard**: Real-time document count by type
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Technical Features
- **TypeScript**: Full type safety and better developer experience
- **Modern React**: Hooks, Context API, and functional components
- **Tailwind CSS**: Utility-first styling with custom animations
- **Component Architecture**: Reusable, maintainable component structure
- **State Management**: React Context for global document state
- **File Type Detection**: Automatic file type classification
- **Loading States**: Smooth loading indicators and error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Heroicons (via SVG)
- **Development**: ESLint, PostCSS

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles and custom CSS
├── components/            # Reusable UI components
│   ├── DocumentCard.tsx   # Individual document display card
│   ├── DocumentList.tsx   # Grid layout for document cards
│   ├── Layout.tsx         # Page layout with header/footer
│   ├── SearchBar.tsx      # Search input component
│   └── ViewModal.tsx      # Document viewer modal
├── context/               # React Context providers
│   └── DocumentContext.tsx # Document state management
├── types/                 # TypeScript type definitions
│   └── document.ts        # Document interfaces and enums
└── lib/                   # Utility functions
    └── fileUtils.ts       # File handling utilities
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 💾 Sample Data

The application comes with mock data including various document types:
- PDF documents (Annual Report, Training Manual)
- Images (Team Photo, Company Logo)
- Videos (Presentation Video)
- Audio files (Meeting Recording)
- Spreadsheets (Sales Data)
- Text documents (Project Proposal)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Accessibility**: Focus management and keyboard navigation
- **Visual Feedback**: Loading spinners, success/error states
- **File Type Icons**: Visual indicators for different document types

## 🔧 Customization

### Adding New Document Types
1. Update the `DocumentType` enum in `src/types/document.ts`
2. Add file extension mapping in `src/lib/fileUtils.ts`
3. Add icon mapping in the `getFileIcon` function
4. Update the viewer logic in `ViewModal.tsx`

### Styling Changes
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in components for specific styling
- Add custom CSS animations and transitions

### State Management
The application uses React Context for state management. To extend functionality:
- Add new methods to `DocumentContext.tsx`
- Update the `DocumentContextType` interface
- Implement new actions in the context provider

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest) 
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Future Enhancements

- [ ] File upload functionality
- [ ] User authentication and authorization
- [ ] Document categories and tags
- [ ] Advanced filtering options
- [ ] Document versioning
- [ ] Collaborative features
- [ ] Backend API integration
- [ ] Database storage
- [ ] File compression and optimization
- [ ] Bulk operations

## 📄 License

This project is created for educational and portfolio purposes.

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

---

**Built with ❤️ using Next.js and TypeScript**
