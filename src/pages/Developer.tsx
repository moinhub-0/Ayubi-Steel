import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Layout, Code2, Rocket, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Developer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <Link to="/" className="inline-flex items-center text-sm uppercase tracking-widest text-slate-400 hover:text-white mb-12 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Site
        </Link>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-16">
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Moinuddin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Hasan.</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-slate-400 max-w-2xl leading-relaxed">
              Senior Full-Stack Web Developer. I build high-converting, professional web applications and exceptional digital experiences.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="mailto:moincomp06@gmail.com" className="bg-white text-slate-900 px-6 py-3 rounded-full font-medium inline-flex items-center hover:bg-slate-200 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Contact Me
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white px-6 py-3 rounded-full font-medium inline-flex items-center hover:bg-slate-700 border border-slate-700 transition-colors">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white px-6 py-3 rounded-full font-medium inline-flex items-center hover:bg-slate-700 border border-slate-700 transition-colors">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </div>
          </motion.div>

          {/* About & Skills */}
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">About Me</h2>
              <div className="space-y-4 text-slate-400 font-light leading-relaxed">
                <p>
                  With expertise spanning modern frontend frameworks and robust backend architecture, I specialize in transforming complex business requirements into sleek, scalable, and secure web solutions.
                </p>
                <p>
                  Whether it's creating breathtaking UI animations with Framer Motion, architecting real-time databases with Firebase, or building performant applications with React and Next.js, my focus is always on delivering exceptional quality.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Core Expertise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Layout className="h-5 w-5 text-indigo-400" />, title: "Frontend Masters", desc: "React, Next.js, Tailwind CSS" },
                  { icon: <Code2 className="h-5 w-5 text-blue-400" />, title: "Backend Systems", desc: "Node.js, Express, Firebase" },
                  { icon: <Rocket className="h-5 w-5 text-indigo-400" />, title: "Web Performance", desc: "Optimization, SEO, Core Web Vitals" }
                ].map((skill, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                    <div className="mb-3">{skill.icon}</div>
                    <h3 className="font-medium text-white mb-1">{skill.title}</h3>
                    <p className="text-sm text-slate-400 font-light">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Project Reference */}
          <motion.div variants={fadeInUp}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl overflow-hidden p-8 md:p-12">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-white mb-4">Want a website like this?</h2>
                <p className="text-slate-400 font-light mb-8 leading-relaxed">
                  I built the Ayubi Steel platform featuring dynamic product galleries, real-time database integrations, secure admin dashboards, and high-end animations.
                </p>
                <a href="mailto:moincomp06@gmail.com" className="inline-flex items-center text-white font-medium hover:text-indigo-400 transition-colors">
                  Discuss Your Next Project
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
