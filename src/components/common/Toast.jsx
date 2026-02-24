import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const styles = {
        success: 'bg-white border-green-100 text-green-800',
        error: 'bg-white border-red-100 text-red-800',
        info: 'bg-white border-blue-100 text-blue-800'
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border mb-3 animate-in fade-in slide-in-from-right-4 duration-300 min-w-[300px] ${styles[type]}`}>
            {icons[type]}
            <p className="flex-1 text-sm font-bold">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
