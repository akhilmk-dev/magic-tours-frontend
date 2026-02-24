import React from 'react';
import { User, FileText, Plane, Upload, CheckCircle } from 'lucide-react';

const steps = [
    { title: 'Personal Information', icon: User, subtitle: 'Current Step' },
    { title: 'Passport Details', icon: FileText, subtitle: 'Step 2' },
    { title: 'Travel Information', icon: Plane, subtitle: 'Step 3' },
    { title: 'Document Upload', icon: Upload, subtitle: 'Step 4' },
    { title: 'Final Review', icon: CheckCircle, subtitle: 'Step 5' }
];

const VisaSteps = ({ currentStep }) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
            <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 -z-10" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;

                    return (
                        <div key={index} className="flex items-start gap-4">
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 z-10
                                ${isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : isCurrent
                                        ? 'bg-white border-green-500 text-green-500'
                                        : 'bg-white border-gray-200 text-gray-400'}
                            `}>
                                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                            </div>
                            <div className="pt-2">
                                <h3 className={`font-bold text-sm ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.title}
                                </h3>
                                <p className={`text-xs ${isCurrent ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisaSteps;
