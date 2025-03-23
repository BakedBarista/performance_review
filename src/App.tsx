import PerformanceReview from './components/PerformanceReview'

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PerformanceReview formAnswers={[3, 4, 5, 3, 4, 2, 5, 4, 3, 4, 5, 3, 4]} />
    </div>
  );
}

export default App
