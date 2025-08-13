import RoadmapBoard from './components/RoadmapBoard'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="bg-blue-50 border border-blue-200 p-4 mb-4">
        <h1 className="text-xl font-bold text-blue-800">Roadmap App</h1>
        <p className="text-[#1B3A29]">Roadmap application loaded successfully!</p>
      </div>
      <RoadmapBoard />
    </div>
  )
}

export default App
