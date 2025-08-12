# GitHub Profile README Generator

A modern, AI-powered tool to create stunning GitHub profile README files with ease. Built with React, TypeScript, and Google's Gemini AI.

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini AI to create personalized profile content
- 🎨 **Real-time Preview**: See your profile README as you build it
- 📝 **Customizable Templates**: Multiple sections and layouts to choose from
- 🔧 **Easy Configuration**: Simple form-based interface for all your profile details
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast & Modern**: Built with Vite and React 19 for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/laravelgpt/Github-profile-generate.git
   cd Github-profile-generate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start creating your profile!

## 🛠️ Usage

1. **Fill out the form** with your personal information, skills, and preferences
2. **Preview in real-time** how your GitHub profile will look
3. **Generate AI content** for sections like bio, skills, and achievements
4. **Copy the generated markdown** and paste it into your GitHub profile README

## 📁 Project Structure

```
├── components/
│   ├── AIPanel.tsx          # AI generation interface
│   ├── FormControls.tsx     # Form input components
│   ├── FormPanel.tsx        # Main form container
│   └── PreviewPanel.tsx     # Live preview component
├── types.ts                 # TypeScript type definitions
├── constants.ts             # Application constants
└── App.tsx                  # Main application component
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI Integration**: Google Gemini AI
- **Styling**: Modern CSS with responsive design
- **Markdown**: Marked library for markdown rendering

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- The React and Vite communities for excellent tooling
- All contributors who help improve this project

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/laravelgpt/Github-profile-generate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/laravelgpt/Github-profile-generate/discussions)

---

⭐ **Star this repository if you found it helpful!**
