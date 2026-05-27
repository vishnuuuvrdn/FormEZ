const steps = ["Requirements", "Links", "How To Apply"];

export default function ProgressStepper({ currentStep }){
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500" }`} >
            {index + 1}
          </div>

          <p className="mt-2 text-sm">{step}</p>
        </div>
      ))}
    </div>
  );
};
