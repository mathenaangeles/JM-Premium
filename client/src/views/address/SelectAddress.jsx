import React from 'react';

const SelectAddress = ({ 
  title = 'Select Address',
  addresses = [], 
  onSelect, 
  onClose,
  addressType = 'shipping'
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          {addresses && addresses.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Addresses</h3>
              </div>
              
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                  onClick={() => {
                    onSelect(address);
                    onClose();
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Type: {address.type || addressType}</div>
                  </div>
                  <div>Street: {address.line_1}</div>
                  {address.line_2 && <div>Street 2: {address.line_2}</div>}
                  <div>City: {address.city}</div>
                  <div>Country: {address.country}</div>
                  <div>Zip Code: {address.zip_code}</div>
                  {address.is_default && (
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Default
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="text-gray-500 p-4 text-center">
              No saved addresses found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;