import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`rounded-xl shadow-sm border p-6 ${className.includes('bg-') ? '' : 'bg-gray-900 border-gray-800'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
