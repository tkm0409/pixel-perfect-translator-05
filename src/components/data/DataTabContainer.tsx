// src/components/data/DataTabContainer.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  required?: boolean;
}

const tabs: Tab[] = [
  { id: 'detail', label: 'Detail', required: true },
  { id: 'configure', label: 'Configure Data' },
  { id: 'compass', label: 'Compass Point', required: true },
  { id: 'additional', label: 'Additional Fields', required: true },
  { id: 'regions', label: 'Regions' },
  { id: 'locations', label: 'Locations' },
  { id: 'mappings', label: 'Mappings', required: true },
];

const DataTabContainer = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('mappings');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium relative",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.label}
              {tab.required && (
                <span className="text-red-500 ml-0.5">*</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DataTabContainer;