# AI Chatbot

An AI chatbot application designed to provide seamless and interactive conversations. Built with Next.js, TypeScript, and Tailwind CSS. The chatbot integrates openai capabilities.

## Features

- 🤖 AI-powered chat interface
- 🎨 Modern UI with Radix UI components
- 🌙 Dark/Light mode support
- 📱 Responsive design
- ⚡ Fast and efficient performance
- 🔒 Type-safe with TypeScript
- 🎯 Form validation with React Hook Form and Zod
- 📝 Markdown support for chat messages
- 💅 Styled with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form + Zod
- **AI Integration:** OpenAI SDK
- **State Management:** React Hooks
- **Animation:** Framer Motion
- **Markdown:** React Markdown
- **Syntax Highlighting:** React Syntax Highlighter

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd tars-ai-chatbot
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [OpenAI](https://openai.com/) 