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

type Item = { name: string; purpose: string }

type Understanding = {
  appName: string
  summary: string
  users: string
  problem: string
  goal: string
  features: string[]
  platform: string
  plan: {
    frontend: string
    backend: string
    data: string
    screens: Item[]
    architecture: Item[]
    apiEndpoints: Item[]
  }
  explain: {
    frontend: string
    backend: string
    data: string
    technicalDecisions: Item[]
    components: Item[]
  }
  learn: {
    path: Item[]
    exercises: Item[]
  }
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [activeStage, setActiveStage] = useState('understand')
  const [started, setStarted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('Web')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiError, setAiError] = useState('')
  const [understanding, setUnderstanding] = useState<Understanding | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [prototypeReady, setPrototypeReady] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

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

      setUnderstanding({ ...data, platform: selectedPlatform })
      setStarted(true)
      setConfirmed(false)
      setPrototypeReady(false)
      setPreviewOpen(false)
      setActiveStage('understand')
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unable to connect to the AI service.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const confirmRequirements = () => {
    if (!understanding) return
    setUnderstanding({ ...understanding, platform: selectedPlatform })
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
    setAiError('')
  }

  const goTo = (stage: string) => {
    if (stage === 'understand' || confirmed) setActiveStage(stage)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div>
            <div className="brand-name">Build Your Own App</div>
            <div className="brand-caption">AI development workspace</div>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <button className="new-project" onClick={resetProject}>
          <Plus size={17} /> New project
        </button>

        <nav className="stage-nav">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const active = activeStage === stage.id
            return (
              <button key={stage.id} className={`stage-item ${active ? 'active' : ''}`} onClick={() => goTo(stage.id)}>
                <span className="stage-number">0{index + 1}</span>
                <Icon size={17} />
                <span>{stage.label}</span>
                {active && <ChevronRight size={15} className="stage-arrow" />}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-status">
            <span className="status-dot" />
            <div><strong>AI ready</strong><small>Development assistant online</small></div>
          </div>
          <div className="version">Build Your Own App · v0.2</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{started ? understanding?.appName : 'New project'}
          </div>
          <div className="top-actions">
            <span className="autosave"><span className="save-dot" /> Autosaved</span>
            <button className="avatar">NP</button>
          </div>
        </header>

        <section className="content">
          {!started && (
            <>
              <div className="hero-section">
                <div className="eyebrow"><WandSparkles size={15} /> AI-powered app development</div>
                <h1>Build your own app.<br /><span>Understand every step.</span></h1>
                <p className="hero-description">
                  Turn an idea into a working application while AI guides you through understanding,
                  planning, building, explaining and learning.
                </p>
              </div>

              <div className="prompt-card">
                <div className="prompt-header">
                  <div>
                    <span className="prompt-label">START WITH AN IDEA</span>
                    <h2>What do you want to build?</h2>
                  </div>
                  <div className="prompt-badge"><Sparkles size={14} /> AI guided</div>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your app idea in your own words..."
                  rows={5}
                />

                {aiError && <div className="ai-error">{aiError}</div>}

                <div className="prompt-footer">
                  <span>Don't worry about technical details. We'll figure them out together.</span>
                  <button className="start-button" onClick={generateUnderstanding} disabled={!prompt.trim() || isGeneratingAI}>
                    {isGeneratingAI ? 'Understanding your idea...' : 'Start building'}
                    {!isGeneratingAI && <ArrowRight size={17} />}
                  </button>
                </div>
              </div>

              <div className="journey">
                <div className="journey-heading">
                  <div><span className="section-label">THE JOURNEY</span><h3>From idea to understanding</h3></div>
                  <span className="journey-count">5 stages</span>
                </div>
                <div className="journey-grid">
                  {stages.map((stage, index) => {
                    const Icon = stage.icon
                    const descriptions = [
                      'Turn your idea into clear requirements.',
                      'Create the features, screens and architecture.',
                      'Generate the application and bring it to life.',
                      'Understand the code and technical decisions.',
                      'Learn how to modify and extend your app.',
                    ]
                    return (
                      <div className="journey-card" key={stage.id}>
                        <div className="journey-icon"><Icon size={19} /></div>
                        <span className="journey-number">0{index + 1}</span>
                        <h4>{stage.label}</h4>
                        <p>{descriptions[index]}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {started && understanding && (
            <>
              <div className="working-area">
                <div className="working-header">
                  <div>
                    <span className="section-label">
                      0{stages.findIndex((s) => s.id === activeStage) + 1} · {activeStage.toUpperCase()}
                    </span>
                    <h1>
                      {activeStage === 'understand' && "Let's understand your idea."}
                      {activeStage === 'plan' && "Let's plan your app."}
                      {activeStage === 'build' && 'Build your app.'}
                      {activeStage === 'explain' && 'Understand what AI built.'}
                      {activeStage === 'learn' && 'Learn how to extend your app.'}
                    </h1>
                    <p>{understanding.summary}</p>
                  </div>
                  {activeStage === 'understand' && (
                    <button className="change-button" onClick={resetProject}><RotateCcw size={13} /> Start over</button>
                  )}
                </div>

                <div className="progress-line">
                  {stages.map((stage, index) => {
                    const Icon = stage.icon
                    return (
                      <button key={stage.id} className={`progress-stage ${activeStage === stage.id ? 'current' : ''}`} onClick={() => goTo(stage.id)}>
                        <span><Icon size={16} /></span>
                        <div><small>0{index + 1}</small><strong>{stage.label}</strong></div>
                      </button>
                    )
                  })}
                </div>

                {activeStage === 'understand' && (
                  <>
                    <div className="ai-panel">
                      <div className="ai-panel-icon"><Sparkles size={20} /></div>
                      <div>
                        <span className="section-label">AI DEVELOPMENT ASSISTANT</span>
                        <h2>Here's what I understand.</h2>
                        <p>Gemini converted your idea into a structured product definition. Review it before the AI creates the technical plan.</p>
                      </div>
                    </div>

                    <div className="understanding-grid">
                      {[
                        ['APP', understanding.appName, understanding.summary],
                        ['TARGET USERS', understanding.users, 'Primary users this application is designed for.'],
                        ['PROBLEM', understanding.problem, 'The main problem the product aims to solve.'],
                        ['GOAL', understanding.goal, 'The intended outcome of the application.'],
                      ].map(([label, title, text]) => (
                        <div className="understanding-card" key={label}>
                          <span>{label}</span><h3>{title}</h3><p>{text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="question-card">
                      <span className="question-number">CORE FEATURES · AI GENERATED</span>
                      <h3>What the first version should include</h3>
                      <div className="feature-list">
                        {understanding.features.map((feature) => (
                          <div className="feature-item" key={feature}><span className="feature-check"><Check size={13} /></span>{feature}</div>
                        ))}
                      </div>
                    </div>

                    <div className="question-card">
                      <span className="question-number">01 · CLARIFY</span>
                      <h3>Where should this app run?</h3>
                      <p>Choosing the platform helps us make better architecture and UI decisions.</p>
                      <div className="answer-options">
                        {['Web', 'Mobile', 'Both'].map((platform) => (
                          <button key={platform} className={selectedPlatform === platform ? 'selected-answer' : ''} onClick={() => setSelectedPlatform(platform)}>
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="continue-row">
                      <div><span className="section-label">NEXT STEP</span><p>Confirm the requirements, then inspect the AI-generated technical blueprint.</p></div>
                      <button className="start-button" onClick={confirmRequirements}>Confirm & continue <ArrowRight size={17} /></button>
                    </div>
                  </>
                )}

                {activeStage === 'plan' && confirmed && (
                  <>
                    <div className="ai-panel">
                      <div className="ai-panel-icon"><ClipboardList size={20} /></div>
                      <div>
                        <span className="section-label">AI APP PLANNER</span>
                        <h2>Your development blueprint is ready.</h2>
                        <p>Gemini translated the confirmed requirements into screens, architecture, data and API plans for the MVP.</p>
                      </div>
                    </div>

                    <div className="plan-grid">
                      <div className="plan-card"><span>PLATFORM</span><h3>{understanding.platform}</h3></div>
                      <div className="plan-card"><span>FRONTEND</span><h3>{understanding.plan.frontend}</h3></div>
                      <div className="plan-card"><span>BACKEND</span><h3>{understanding.plan.backend}</h3></div>
                      <div className="plan-card"><span>DATA</span><h3>{understanding.plan.data}</h3></div>
                    </div>

                    <PlanList title="SCREENS" items={understanding.plan.screens} />
                    <PlanList title="ARCHITECTURE" items={understanding.plan.architecture} />
                    <PlanList title="API / DATA CONTRACT" items={understanding.plan.apiEndpoints} />

                    <div className="continue-row">
                      <div><span className="section-label">NEXT STEP</span><p>Use this blueprint as the source of truth for the prototype build.</p></div>
                      <button className="start-button" onClick={() => setActiveStage('build')}>Continue to Build <ArrowRight size={17} /></button>
                    </div>
                  </>
                )}

                {activeStage === 'build' && confirmed && (
                  <>
                    {!isBuilding && !prototypeReady && (
                      <>
                        <div className="ai-panel">
                          <div className="ai-panel-icon"><Hammer size={20} /></div>
                          <div>
                            <span className="section-label">AI BUILD ENGINE</span>
                            <h2>Turn the blueprint into a prototype.</h2>
                            <p>The current prototype simulates the build pipeline using the AI-approved requirements and plan.</p>
                          </div>
                        </div>

                        <div className="build-summary">
                          <div className="build-summary-header">
                            <div><span className="section-label">PROJECT BLUEPRINT</span><h3>{understanding.appName}</h3></div>
                            <span className="platform-pill">{understanding.platform}</span>
                          </div>
                          <div className="build-feature-list">
                            {understanding.features.map((feature, index) => (
                              <div className="build-feature" key={feature}><span>0{index + 1}</span><Check size={14} />{feature}</div>
                            ))}
                          </div>
                          <button className="generate-button" onClick={generatePrototype}><Sparkles size={17} /> Generate Prototype <ArrowRight size={17} /></button>
                        </div>
                      </>
                    )}

                    {isBuilding && (
                      <div className="build-progress">
                        <div className="build-spinner"><Sparkles size={21} /></div>
                        <span className="section-label">AI BUILD ENGINE</span>
                        <h2>Building {understanding.appName}...</h2>
                        <p>Turning the AI-generated blueprint into a working prototype experience.</p>
                        <div className="build-steps">
                          <div className="build-step done"><Check size={14} /> Analyzing requirements</div>
                          <div className="build-step done"><Check size={14} /> Applying development plan</div>
                          <div className="build-step active"><span className="mini-loader" /> Generating components</div>
                          <div className="build-step"><span className="step-circle" /> Preparing preview</div>
                        </div>
                      </div>
                    )}

                    {prototypeReady && !previewOpen && (
                      <div className="prototype-ready">
                        <div className="ready-icon"><Check size={25} /></div>
                        <span className="section-label">PROTOTYPE READY</span>
                        <h2>{understanding.appName} is ready.</h2>
                        <p>Your prototype experience has been prepared from the approved AI blueprint.</p>
                        <div className="ready-actions">
                          <button className="generate-button" onClick={() => setPreviewOpen(true)}>Open Preview <ArrowRight size={17} /></button>
                          <button className="change-button" onClick={() => setPrototypeReady(false)}>Regenerate</button>
                        </div>
                      </div>
                    )}

                    {prototypeReady && previewOpen && (
                      <div className="app-preview">
                        <div className="preview-topbar">
                          <div><span className="preview-logo">✦</span><strong>{understanding.appName}</strong></div>
                          <button className="change-button" onClick={() => setPreviewOpen(false)}>Close preview</button>
                        </div>
                        <div className="preview-body">
                          <div className="preview-welcome">
                            <span>GENERATED PROTOTYPE</span>
                            <h2>{understanding.appName}</h2>
                            <p>{understanding.summary}</p>
                          </div>
                          <div className="preview-cards">
                            {understanding.features.map((feature, index) => (
                              <div className="preview-card" key={feature}>
                                <div className="preview-card-icon">{index + 1}</div>
                                <h3>{feature}</h3>
                                <p>Prototype entry generated from the approved MVP requirement.</p>
                                <button>Explore <ArrowRight size={13} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {prototypeReady && (
                      <div className="continue-row">
                        <div><span className="section-label">NEXT STEP</span><p>Review how the architecture and technical decisions map to the generated experience.</p></div>
                        <button className="start-button" onClick={() => setActiveStage('explain')}>Continue to Explain <ArrowRight size={17} /></button>
                      </div>
                    )}
                  </>
                )}

                {activeStage === 'explain' && confirmed && (
                  <>
                    <div className="ai-panel">
                      <div className="ai-panel-icon"><Search size={20} /></div>
                      <div>
                        <span className="section-label">AI CODE EXPLAINER</span>
                        <h2>Here's how your app is put together.</h2>
                        <p>These explanations come from the same AI-generated blueprint, so you can connect product requirements to technical implementation.</p>
                      </div>
                    </div>

                    <div className="plan-grid">
                      <div className="plan-card"><span>FRONTEND</span><h3>{understanding.explain.frontend}</h3></div>
                      <div className="plan-card"><span>BACKEND</span><h3>{understanding.explain.backend}</h3></div>
                      <div className="plan-card"><span>DATA</span><h3>{understanding.explain.data}</h3></div>
                      <div className="plan-card"><span>PLATFORM</span><h3>{understanding.platform}</h3></div>
                    </div>

                    <PlanList title="KEY COMPONENTS" items={understanding.explain.components} />
                    <PlanList title="TECHNICAL DECISIONS" items={understanding.explain.technicalDecisions} />

                    <div className="question-card">
                      <span className="question-number">ARCHITECTURE</span>
                      <h3>The full journey</h3>
                      <div className="blueprint-list">
                        {[
                          ['01', 'User idea', 'Natural-language product request.'],
                          ['02', 'Understand', 'Gemini structures users, problem, goal and features.'],
                          ['03', 'Plan', 'Gemini creates screens, architecture and API/data contracts.'],
                          ['04', 'Build', 'The approved blueprint drives the prototype build experience.'],
                          ['05', 'Explain', 'The generated architecture and decisions are made understandable.'],
                          ['06', 'Learn', 'The project becomes a guided environment for future changes.'],
                        ].map(([number, title, description]) => (
                          <div className="blueprint-item" key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></div>
                        ))}
                      </div>
                    </div>

                    <div className="continue-row">
                      <div><span className="section-label">NEXT STEP</span><p>Learn what to change first and how to grow {understanding.appName} beyond the prototype.</p></div>
                      <button className="start-button" onClick={() => setActiveStage('learn')}>Continue to Learn <ArrowRight size={17} /></button>
                    </div>
                  </>
                )}

                {activeStage === 'learn' && confirmed && (
                  <>
                    <div className="ai-panel">
                      <div className="ai-panel-icon"><GraduationCap size={20} /></div>
                      <div>
                        <span className="section-label">AI LEARNING GUIDE</span>
                        <h2>Learn by changing the app.</h2>
                        <p>Your learning path is generated from {understanding.appName}'s actual plan, features and architecture.</p>
                      </div>
                    </div>

                    <PlanList title="YOUR LEARNING PATH" items={understanding.learn.path} />
                    <PlanList title="PROJECT EXERCISES" items={understanding.learn.exercises} />

                    <div className="question-card">
                      <span className="question-number">TRY IT YOURSELF</span>
                      <h3>Start with one small change</h3>
                      <p>Pick an exercise, make the change in the project, run it again and compare the result with the original blueprint.</p>
                      <div className="feature-list">
                        {understanding.learn.exercises.map((item) => (
                          <div className="feature-item" key={item.name}><span className="feature-check"><Check size={13} /></span><div><strong>{item.name}</strong><p>{item.purpose}</p></div></div>
                        ))}
                      </div>
                    </div>

                    <div className="continue-row">
                      <div><span className="section-label">JOURNEY COMPLETE</span><p>You went from an idea to requirements, planning, building, explanation and app-specific learning.</p></div>
                      <button className="start-button" onClick={() => setActiveStage('build')}>Back to App <ArrowRight size={17} /></button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

function PlanList({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="question-card">
      <span className="question-number">{title}</span>
      <div className="blueprint-list">
        {items.map((item, index) => (
          <div className="blueprint-item" key={item.name}>
            <span>0{index + 1}</span>
            <div><strong>{item.name}</strong><p>{item.purpose}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
