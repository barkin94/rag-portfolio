export default function Profile() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">
          WELCOME TO MY PORTFOLIO
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-4xl md:text-5xl text-white">
            👤
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">John Doe</h2>
            <div className="text-xl md:text-2xl text-blue-600 font-semibold mb-3">Full Stack Developer</div>
            <p className="text-gray-600 text-lg">Building digital experiences that make a difference</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border-l-4 border-green-500 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🚀</span> About Me
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Passionate full-stack developer with 5+ years of experience building scalable web applications.
            Specializing in React, Next.js, Node.js, and cloud technologies. I love turning complex
            problems into simple, beautiful solutions.
          </p>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"> */}
      {/*   <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"> */}
      {/*     <div className="text-4xl mb-4">💼</div> */}
      {/*     <h3 className="text-xl font-bold text-gray-900 mb-3">Projects</h3> */}
      {/*     <p className="text-gray-600">Explore my portfolio of web applications, open-source contributions, and side projects</p> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"> */}
      {/*     <div className="text-4xl mb-4">⚡</div> */}
      {/*     <h3 className="text-xl font-bold text-gray-900 mb-3">Skills</h3> */}
      {/*     <p className="text-gray-600">Discover my technical stack, frameworks, and tools I use to build amazing products</p> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"> */}
      {/*     <div className="text-4xl mb-4">💬</div> */}
      {/*     <h3 className="text-xl font-bold text-gray-900 mb-3">Experience Chat</h3> */}
      {/*     <p className="text-gray-600">Ask me anything about my work experience, projects, or technical expertise</p> */}
      {/*   </div> */}
      {/* </div> */}
    </section>
  )

}

