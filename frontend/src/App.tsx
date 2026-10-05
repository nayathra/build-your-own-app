import { useState } from 'react'



import {



  Sparkles,



  Brain,



  ClipboardList,



  Hammer,



  Search,



  GraduationCap,



  ArrowRight,



  Plus,



  ChevronRight,



  WandSparkles,



  Check,



  RotateCcw,



} from 'lucide-react'



import './App.css'







const stages = [



  { id: 'understand', label: 'Understand', icon: Brain },



  { id: 'plan', label: 'Plan', icon: ClipboardList },



  { id: 'build', label: 'Build', icon: Hammer },



  { id: 'explain', label: 'Explain', icon: Search },



  { id: 'learn', label: 'Learn', icon: GraduationCap },



]







type Understanding = {



  appName: string



  summary: string



  users: string



  problem: string



  goal: string



  platform: string



  features: string[]



}







function App() {



  const [prompt, setPrompt] = useState('')



  const [activeStage, setActiveStage] = useState('understand')



  const [started, setStarted] = useState(false)



  const [confirmed, setConfirmed] = useState(false)



  const [selectedPlatform, setSelectedPlatform] = useState('Web')



  const [isBuilding, setIsBuilding] = useState(false)



const [prototypeReady, setPrototypeReady] = useState(false)



const [previewOpen, setPreviewOpen] = useState(false)







  const [understanding, setUnderstanding] = useState<Understanding | null>(



    null,



  )







  
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const [aiError, setAiError] = useState('')
  const generateUnderstanding = async () => {

    if (!prompt.trim() || isGeneratingAI) return

    setIsGeneratingAI(true)
    setAiError('')

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'AI analysis failed. Please try again.')
      }

      setUnderstanding({
        appName: data.appName,
        summary: data.summary,
        users: data.users,
        problem: data.problem,
        goal: data.goal,
        platform: selectedPlatform,
        features: data.features,
      })

      setStarted(true)
      setConfirmed(false)
      setPrototypeReady(false)
      setPreviewOpen(false)
      setActiveStage('understand')
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the AI service.',
      )
    } finally {
      setIsGeneratingAI(false)
    }
  }


  const confirmRequirements = () => {



  if (!understanding) return







  setUnderstanding({



    ...understanding,



    platform: selectedPlatform,



  })







  setConfirmed(true)



  setActiveStage('plan')



}







  const generatePrototype = () => {

    setIsBuilding(true)

    setPrototypeReady(false)

    setPreviewOpen(false)



    setTimeout(() => {

      setIsBuilding(false)

      setPrototypeReady(true)

    }, 3000)

  }



  const resetProject = () => {



    setPrompt('')



    setStarted(false)



    setConfirmed(false)



    setUnderstanding(null)



    setActiveStage('understand')

    setIsBuilding(false)

    setPrototypeReady(false)

    setPreviewOpen(false)



  }







  return (



    <div className="app-shell">



      {/* Sidebar */}



      <aside className="sidebar">



        <div className="brand">



          <div className="brand-mark">



            <Sparkles size={18} />



          </div>







          <div>



            <div className="brand-name">Build Your Own App</div>



            <div className="brand-caption">AI development workspace</div>



          </div>



        </div>







        <div className="workspace-label">WORKSPACE</div>







        <button className="new-project" onClick={resetProject}>



          <Plus size={17} />



          New project



        </button>







        <nav className="stage-nav">



          {stages.map((stage, index) => {



            const Icon = stage.icon



            const isActive = activeStage === stage.id







            return (



              <button



                key={stage.id}



                className={`stage-item ${isActive ? 'active' : ''}`}



                onClick={() => {



                  if (stage.id === 'understand' || confirmed) {



                    setActiveStage(stage.id)



                  }



                }}



              >



                <span className="stage-number">0{index + 1}</span>







                <Icon size={17} />







                <span>{stage.label}</span>







                {isActive && (



                  <ChevronRight size={15} className="stage-arrow" />



                )}



              </button>



            )



          })}



        </nav>







        <div className="sidebar-bottom">



          <div className="ai-status">



            <span className="status-dot"></span>







            <div>



              <strong>AI ready</strong>



              <small>Development assistant online</small>



            </div>



          </div>







          <div className="version">Build Your Own App · v0.1</div>



        </div>



      </aside>







      {/* Main */}



      <main className="main-content">



        <header className="topbar">



          <div className="breadcrumb">



            Workspace <span>/</span>



            {started ? understanding?.appName : 'New project'}



          </div>







          <div className="top-actions">



            <span className="autosave">



              <span className="save-dot"></span>



              Autosaved



            </span>







            <button className="avatar">NP</button>



          </div>



        </header>







        <section className="content">



          {/* LANDING */}



          {!started && (



            <>



              <div className="hero-section">



                <div className="eyebrow">



                  <WandSparkles size={15} />



                  AI-powered app development



                </div>







                <h1>



                  Build your own app.



                  <br />



                  <span>Understand every step.</span>



                </h1>







                <p className="hero-description">



                  Turn an idea into a working application while AI guides you



                  through understanding, planning, building, explaining and



                  learning.



                </p>



              </div>







              <div className="prompt-card">



                <div className="prompt-header">



                  <div>



                    <span className="prompt-label">START WITH AN IDEA</span>







                    <h2>What do you want to build?</h2>



                  </div>







                  <div className="prompt-badge">



                    <Sparkles size={14} />



                    AI guided



                  </div>



                </div>







                <textarea



                  value={prompt}



                  onChange={(e) => setPrompt(e.target.value)}



                  placeholder="Describe your app idea in your own words..."



                  rows={5}



                />







                {aiError && (
                  <div className="ai-error">
                    {aiError}
                  </div>
                )}

                <div className="prompt-footer">



                  <span>



                    Don't worry about technical details. We'll figure them out



                    together.



                  </span>







                  <button



                    className="start-button"



                    onClick={generateUnderstanding}



                    disabled={!prompt.trim() || isGeneratingAI}



                  >

                    {isGeneratingAI ? 'Understanding your idea...' : 'Start building'}

                    {!isGeneratingAI && <ArrowRight size={17} />}



                  </button>



                </div>



              </div>







              <div className="journey">



                <div className="journey-heading">



                  <div>



                    <span className="section-label">THE JOURNEY</span>







                    <h3>From idea to understanding</h3>



                  </div>







                  <span className="journey-count">5 stages</span>



                </div>







                <div className="journey-grid">



                  {stages.map((stage, index) => {



                    const Icon = stage.icon







                    return (



                      <div className="journey-card" key={stage.id}>



                        <div className="journey-icon">



                          <Icon size={19} />



                        </div>







                        <span className="journey-number">0{index + 1}</span>







                        <h4>{stage.label}</h4>







                        <p>



                          {index === 0 &&



                            'Turn your idea into clear requirements.'}







                          {index === 1 &&



                            'Create the features, screens and architecture.'}







                          {index === 2 &&



                            'Generate the application and bring it to life.'}







                          {index === 3 &&



                            'Understand the code and technical decisions.'}







                          {index === 4 &&



                            'Learn how to modify and extend your app.'}



                        </p>



                      </div>



                    )



                  })}



                </div>



              </div>



            </>



          )}







          {/* UNDERSTAND */}



          {started && activeStage === 'understand' && understanding && (



            <div className="working-area">



              <div className="working-header">



                <div>



                  <span className="section-label">01 · UNDERSTAND</span>







                  <h1>Let's understand your idea.</h1>







                  <p>{understanding.summary}</p>



                </div>







                <button className="change-button" onClick={resetProject}>



                  <RotateCcw size={13} />



                  Start over



                </button>



              </div>







              {/* Progress */}



              <div className="progress-line">



                {stages.map((stage, index) => {



                  const Icon = stage.icon







                  return (



                    <button



                      key={stage.id}



                      className={`progress-stage ${



                        activeStage === stage.id ? 'current' : ''



                      }`}



                      onClick={() => {



                        if (stage.id === 'understand' || confirmed) {



                          setActiveStage(stage.id)



                        }



                      }}



                    >



                      <span>



                        <Icon size={16} />



                      </span>







                      <div>



                        <small>0{index + 1}</small>



                        <strong>{stage.label}</strong>



                      </div>



                    </button>



                  )



                })}



              </div>







              {/* AI understanding */}



              <div className="ai-panel">



                <div className="ai-panel-icon">



                  <Sparkles size={20} />



                </div>







                <div>



                  <span className="section-label">



                    AI DEVELOPMENT ASSISTANT



                  </span>







                  <h2>Here's what I understand.</h2>







                  <p>



                    I've converted your idea into an initial product



                    understanding. Review it before we create the technical



                    plan.



                  </p>



                </div>



              </div>







              {/* Understanding cards */}



              <div className="understanding-grid">



                <div className="understanding-card">



                  <span>APP</span>



                  <h3>{understanding.appName}</h3>



                  <p>{understanding.summary}</p>



                </div>







                <div className="understanding-card">



                  <span>TARGET USERS</span>



                  <h3>{understanding.users}</h3>



                  <p>Primary users this application is designed for.</p>



                </div>







                <div className="understanding-card">



                  <span>PROBLEM</span>



                  <h3>{understanding.problem}</h3>



                  <p>The main problem the product aims to solve.</p>



                </div>







                <div className="understanding-card">



                  <span>GOAL</span>



                  <h3>{understanding.goal}</h3>



                  <p>The intended outcome of the application.</p>



                </div>



              </div>







              {/* Features */}



              <div className="question-card">



                <span className="question-number">CORE FEATURES</span>







                <h3>What the first version should include</h3>







                <div className="feature-list">



                  {understanding.features.map((feature) => (



                    <div className="feature-item" key={feature}>



                      <span className="feature-check">



                        <Check size={13} />



                      </span>







                      {feature}



                    </div>



                  ))}



                </div>



              </div>







              {/* Platform */}



              <div className="question-card">



                <span className="question-number">01 · CLARIFY</span>







                <h3>Where should this app run?</h3>







                <p>



                  Choosing the platform helps us make better architecture and



                  UI decisions.



                </p>







                <div className="answer-options">



                  {['Web', 'Mobile', 'Both'].map((platform) => (



                    <button



                      key={platform}



                      className={



                        selectedPlatform === platform ? 'selected-answer' : ''



                      }



                      onClick={() => setSelectedPlatform(platform)}



                    >



                      {platform}



                    </button>



                  ))}



                </div>



              </div>







              {/* Continue */}



              <div className="continue-row">



                <div>



                  <span className="section-label">NEXT STEP</span>







                  <p>



                    Once you're happy with the requirements, we'll create the



                    technical blueprint.



                  </p>



                </div>







                <button



                  className="start-button"



                  onClick={confirmRequirements}



                >



                  Confirm & continue



                  <ArrowRight size={17} />



                </button>



              </div>



            </div>



          )}







          {/* PLAN */}



          {started && activeStage === 'plan' && confirmed && understanding && (



            <div className="working-area">



              <div className="working-header">



                <div>



                  <span className="section-label">02 · PLAN</span>







                  <h1>Let's plan your app.</h1>







                  <p>



                    Here's the technical blueprint based on your confirmed



                    requirements.



                  </p>



                </div>



              </div>







              <div className="progress-line">



                {stages.map((stage, index) => {



                  const Icon = stage.icon







                  return (



                    <button



                      key={stage.id}



                      className={`progress-stage ${



                        activeStage === stage.id ? 'current' : ''



                      }`}



                      onClick={() => setActiveStage(stage.id)}



                    >



                      <span>



                        <Icon size={16} />



                      </span>







                      <div>



                        <small>0{index + 1}</small>



                        <strong>{stage.label}</strong>



                      </div>



                    </button>



                  )



                })}



              </div>







              <div className="ai-panel">



                <div className="ai-panel-icon">



                  <ClipboardList size={20} />



                </div>







                <div>



                  <span className="section-label">AI APP PLANNER</span>







                  <h2>Your development blueprint is ready.</h2>







                  <p>



                    The next stage will transform your product idea into



                    screens, features, architecture and a development plan.



                  </p>



                </div>



              </div>







              <div className="plan-grid">



                <div className="plan-card">



                  <span>PLATFORM</span>



                  <h3>{understanding.platform}</h3>



                </div>







                <div className="plan-card">



                  <span>FRONTEND</span>



                  <h3>React + TypeScript</h3>



                </div>







                <div className="plan-card">



                  <span>BACKEND</span>



                  <h3>API + AI services</h3>



                </div>







                <div className="plan-card">



                  <span>DATA</span>



                  <h3>Structured application data</h3>



                </div>



              </div>







              <div className="question-card">



                <span className="question-number">APP BLUEPRINT</span>







                <h3>Suggested development structure</h3>







                <div className="blueprint-list">



                  {[



                    'Authentication & onboarding',



                    'Main application dashboard',



                    ...understanding.features,



                    'Profile and settings',



                  ].map((item, index) => (



                    <div className="blueprint-item" key={`${item}-${index}`}>



                      <span>0{index + 1}</span>



                      {item}



                    </div>



                  ))}



                </div>



              </div>







              <div className="continue-row">



                <div>



                  <span className="section-label">NEXT STEP</span>







                  <p>



                    After planning, AI will generate the first working



                    prototype.



                  </p>



                </div>







                <button



                  className="start-button"



                  onClick={() => setActiveStage('build')}



                >



                  Continue to Build



                  <ArrowRight size={17} />



                </button>



              </div>



            </div>



          )}







          {/* BUILD */}

          {started && activeStage === 'build' && confirmed && understanding && (

            <div className="working-area">

              <div className="working-header">

                <div>

                  <span className="section-label">03 · BUILD</span>

                  <h1>Build your app.</h1>

                  <p>Turn your approved blueprint into a working prototype.</p>

                </div>

              </div>



              <div className="progress-line">

                {stages.map((stage, index) => {

                  const Icon = stage.icon

                  return (

                    <button

                      key={stage.id}

                      className={`progress-stage ${activeStage === stage.id ? 'current' : ''}`}

                      onClick={() => setActiveStage(stage.id)}

                    >

                      <span><Icon size={16} /></span>

                      <div>

                        <small>0{index + 1}</small>

                        <strong>{stage.label}</strong>

                      </div>

                    </button>

                  )

                })}

              </div>



              {!prototypeReady && !isBuilding && (

                <>

                  <div className="ai-panel">

                    <div className="ai-panel-icon"><Hammer size={20} /></div>

                    <div>

                      <span className="section-label">AI BUILD ENGINE</span>

                      <h2>Your blueprint is ready.</h2>

                      <p>I'll turn your requirements and technical plan into a working application prototype.</p>

                    </div>

                  </div>



                  <div className="build-summary">

                    <div className="build-summary-header">

                      <div>

                        <span className="section-label">PROJECT BLUEPRINT</span>

                        <h3>{understanding.appName}</h3>

                      </div>

                      <span className="platform-pill">{understanding.platform}</span>

                    </div>



                    <div className="build-feature-list">

                      {understanding.features.map((feature, index) => (

                        <div className="build-feature" key={feature}>

                          <span>0{index + 1}</span>

                          <Check size={14} />

                          {feature}

                        </div>

                      ))}

                    </div>



                    <button className="generate-button" onClick={generatePrototype}>

                      <Sparkles size={17} />

                      Generate Prototype

                      <ArrowRight size={17} />

                    </button>

                  </div>

                </>

              )}



              {isBuilding && (

                <div className="build-progress">

                  <div className="build-spinner"><Sparkles size={21} /></div>

                  <span className="section-label">AI BUILD ENGINE</span>

                  <h2>Building {understanding.appName}...</h2>

                  <p>Turning your blueprint into a working prototype.</p>

                  <div className="build-steps">

                    <div className="build-step done"><Check size={14} /> Analyzing requirements</div>

                    <div className="build-step done"><Check size={14} /> Designing app structure</div>

                    <div className="build-step active"><span className="mini-loader"></span> Generating components</div>

                    <div className="build-step"><span className="step-circle"></span> Preparing preview</div>

                  </div>

                </div>

              )}



              {prototypeReady && !previewOpen && (

                <div className="prototype-ready">

                  <div className="ready-icon"><Check size={25} /></div>

                  <span className="section-label">PROTOTYPE READY</span>

                  <h2>{understanding.appName} is ready.</h2>

                  <p>Your first application prototype has been generated from the approved blueprint.</p>

                  <div className="ready-actions">

                    <button className="generate-button" onClick={() => setPreviewOpen(true)}>

                      Open Preview <ArrowRight size={17} />

                    </button>

                    <button className="change-button" onClick={() => setPrototypeReady(false)}>

                      Regenerate

                    </button>

                  </div>

                </div>

              )}



              {prototypeReady && previewOpen && (

                <div className="app-preview">

                  <div className="preview-topbar">

                    <div>

                      <span className="preview-logo">✦</span>

                      <strong>{understanding.appName}</strong>

                    </div>

                    <button className="change-button" onClick={() => setPreviewOpen(false)}>

                      Close preview

                    </button>

                  </div>

                  <div className="preview-body">

                    <div className="preview-welcome">

                      <span>WELCOME</span>

                      <h2>Discover your next<br />favorite experience.</h2>

                      <p>A prototype generated from your app idea and development blueprint.</p>

                    </div>

                    <div className="preview-cards">

                      {understanding.features.map((feature, index) => (

                        <div className="preview-card" key={feature}>

                          <div className="preview-card-icon">{index + 1}</div>

                          <h3>{feature}</h3>

                          <p>Explore this feature in your generated application.</p>

                          <button>Explore <ArrowRight size={13} /></button>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}



          {/* EXPLAIN */}

          {started && activeStage === 'explain' && confirmed && understanding && (
            <div className="working-area">
              <div className="working-header">
                <div>
                  <span className="section-label">04 · EXPLAIN</span>
                  <h1>Understand what AI built.</h1>
                  <p>Explore the architecture, data flow and technical decisions behind your application.</p>
                </div>
                {prototypeReady && (
                  <button className="change-button" onClick={() => setActiveStage('build')}>
                    Back to preview
                  </button>
                )}
              </div>

              <div className="progress-line">
                {stages.map((stage, index) => {
                  const Icon = stage.icon
                  return (
                    <button
                      key={stage.id}
                      className={`progress-stage ${activeStage === stage.id ? 'current' : ''}`}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <span><Icon size={16} /></span>
                      <div>
                        <small>0{index + 1}</small>
                        <strong>{stage.label}</strong>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="ai-panel">
                <div className="ai-panel-icon">
                  <Search size={20} />
                </div>
                <div>
                  <span className="section-label">AI CODE EXPLAINER</span>
                  <h2>Here's how your app is put together.</h2>
                  <p>
                    The prototype follows a simple layered structure so you can understand
                    what each part does and where to make changes.
                  </p>
                </div>
              </div>

              <div className="plan-grid">
                <div className="plan-card">
                  <span>FRONTEND</span>
                  <h3>React + TypeScript</h3>
                  <p>Reusable UI components handle screens, interactions and application state.</p>
                </div>

                <div className="plan-card">
                  <span>BACKEND</span>
                  <h3>API + AI services</h3>
                  <p>Application logic and AI capabilities can be exposed through backend services.</p>
                </div>

                <div className="plan-card">
                  <span>DATA</span>
                  <h3>Structured application data</h3>
                  <p>Requirements, features and generated app information are kept in predictable structures.</p>
                </div>

                <div className="plan-card">
                  <span>PLATFORM</span>
                  <h3>{understanding.platform}</h3>
                  <p>The selected platform guides the UI and technical implementation.</p>
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">ARCHITECTURE</span>
                <h3>From your idea to the running prototype</h3>

                <div className="blueprint-list">
                  {[
                    ['01', 'User idea', 'Your natural-language prompt describes the product you want to build.'],
                    ['02', 'Understanding', 'AI converts the idea into users, problem, goal and core features.'],
                    ['03', 'Plan', 'The requirements become a technical blueprint for the application.'],
                    ['04', 'Build', 'The approved blueprint is turned into the first working prototype.'],
                    ['05', 'Preview', 'You can inspect the generated experience before extending it.'],
                  ].map(([number, title, description]) => (
                    <div className="blueprint-item" key={number}>
                      <span>{number}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">KEY COMPONENTS</span>
                <h3>What each part is responsible for</h3>

                <div className="feature-list">
                  {[
                    ['App shell', 'Controls the overall workspace, navigation and project state.'],
                    ['Understanding layer', 'Turns the original prompt into a structured product definition.'],
                    ['Planning layer', 'Organizes features, platform and technical structure.'],
                    ['Build layer', 'Uses the approved plan to prepare the prototype experience.'],
                    ['Preview layer', 'Presents the generated app so you can review the result.'],
                  ].map(([title, description]) => (
                    <div className="feature-item" key={title}>
                      <span className="feature-check"><Check size={13} /></span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">WHY THIS ARCHITECTURE?</span>
                <h3>Technical decisions explained</h3>

                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-check"><Check size={13} /></span>
                    <div>
                      <strong>React + TypeScript</strong>
                      <p>Component-based UI makes individual screens easier to reuse and modify, while TypeScript adds clearer structure to application data.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <span className="feature-check"><Check size={13} /></span>
                    <div>
                      <strong>Layered workflow</strong>
                      <p>Separating Understand, Plan and Build makes the generation process inspectable instead of hiding everything behind one prompt.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <span className="feature-check"><Check size={13} /></span>
                    <div>
                      <strong>Structured requirements</strong>
                      <p>Keeping users, goals and features in predictable fields makes the next stages easier to reason about and eventually connect to an LLM.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">HOW TO MODIFY IT</span>
                <h3>Make the app your own</h3>

                <div className="blueprint-list">
                  {[
                    ['01', 'Add a feature', 'Update the product requirements and blueprint, then regenerate the affected experience.'],
                    ['02', 'Change the UI', 'Find the relevant React component and adjust its layout, content or styling.'],
                    ['03', 'Add an API', 'Create a backend endpoint or service and connect the frontend to it.'],
                    ['04', 'Change the data', 'Update the structured application data and make the UI consume the new fields.'],
                  ].map(([number, title, description]) => (
                    <div className="blueprint-item" key={number}>
                      <span>{number}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="continue-row">
                <div>
                  <span className="section-label">NEXT STEP</span>
                  <p>Once you understand the architecture, learn how to modify and extend the generated application.</p>
                </div>
                <button className="start-button" onClick={() => setActiveStage('learn')}>
                  Continue to Learn
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* LEARN */}

          {started && activeStage === 'learn' && confirmed && understanding && (
            <div className="working-area">
              <div className="working-header">
                <div>
                  <span className="section-label">05 · LEARN</span>
                  <h1>Learn how to extend your app.</h1>
                  <p>Use the generated project as a starting point and learn how to change it step by step.</p>
                </div>
                <button className="change-button" onClick={() => setActiveStage('explain')}>
                  <Search size={13} />
                  View explanation
                </button>
              </div>

              <div className="progress-line">
                {stages.map((stage, index) => {
                  const Icon = stage.icon
                  return (
                    <button
                      key={stage.id}
                      className={`progress-stage ${activeStage === stage.id ? 'current' : ''}`}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <span><Icon size={16} /></span>
                      <div>
                        <small>0{index + 1}</small>
                        <strong>{stage.label}</strong>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="ai-panel">
                <div className="ai-panel-icon">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <span className="section-label">AI LEARNING GUIDE</span>
                  <h2>Learn by changing the app.</h2>
                  <p>
                    Instead of stopping after generation, this stage shows you what to learn
                    next and how each change connects to the application you just built.
                  </p>
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">YOUR LEARNING PATH</span>
                <h3>From small edits to real features</h3>

                <div className="blueprint-list">
                  {[
                    ['01', 'Understand the structure', 'Identify the main components, state and data flow before making changes.'],
                    ['02', 'Change the interface', 'Modify text, spacing, cards, buttons and layouts in the React UI.'],
                    ['03', 'Add a feature', 'Turn a new product requirement into a component and application workflow.'],
                    ['04', 'Connect an API', 'Learn how frontend components communicate with backend services and data.'],
                    ['05', 'Extend and deploy', 'Test the application, improve it and prepare it for real users.'],
                  ].map(([number, title, description]) => (
                    <div className="blueprint-item" key={number}>
                      <span>{number}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="plan-grid">
                <div className="plan-card">
                  <span>PROJECT</span>
                  <h3>{understanding.appName}</h3>
                  <p>Use your generated prototype as the practical learning environment.</p>
                </div>

                <div className="plan-card">
                  <span>FIRST EXERCISE</span>
                  <h3>Change one UI element</h3>
                  <p>Start with a small visual change so you can see the edit → run → review cycle.</p>
                </div>

                <div className="plan-card">
                  <span>NEXT EXERCISE</span>
                  <h3>Add a new feature</h3>
                  <p>Take one requirement and turn it into a new component or workflow.</p>
                </div>

                <div className="plan-card">
                  <span>ADVANCED</span>
                  <h3>Connect real data</h3>
                  <p>Replace prototype data with an API or database when the app is ready.</p>
                </div>
              </div>

              <div className="question-card">
                <span className="question-number">TRY IT YOURSELF</span>
                <h3>What would you change first?</h3>
                <p>
                  Pick one small improvement to your {understanding.appName} prototype.
                  A good first task is adding a feature, changing a screen, or connecting
                  a real data source.
                </p>

                <div className="feature-list">
                  {[
                    'Add a new feature to the current app',
                    'Redesign one screen or component',
                    'Connect a backend API',
                    'Replace prototype data with real data',
                  ].map((item) => (
                    <div className="feature-item" key={item}>
                      <span className="feature-check"><Check size={13} /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="continue-row">
                <div>
                  <span className="section-label">JOURNEY COMPLETE</span>
                  <p>You have gone from an idea to requirements, planning, building, explanation and learning.</p>
                </div>
                <button className="start-button" onClick={() => setActiveStage('build')}>
                  Back to App
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}
</section>



      </main>



    </div>



  )



}







export default App