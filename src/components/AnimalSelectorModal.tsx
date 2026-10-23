import React, { useRef } from 'react';
import { X, Check, ImagePlus, Compass, Info } from 'lucide-react';
import { Animal } from '../types';

interface AnimalSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  currentAnimalId: string;
  onSelectAnimal: (animal: Animal) => void;
  onUploadCustomImage: (animal: Animal) => void;
}

export const AnimalSelectorModal: React.FC<AnimalSelectorModalProps> = ({
  isOpen,
  onClose,
  animals,
  currentAnimalId,
  onSelectAnimal,
  onUploadCustomImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const customAnimal: Animal = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 20) || 'Custom Photo',
          subtitle: 'Personal Uploaded Photo',
          species: 'Custom Image',
          habitat: 'Your Gallery',
          fact: 'Sliding puzzle created with your unique photo.',
          imageUrl: reader.result,
          accentColor: '#38bdf8',
        };
        onUploadCustomImage(customAnimal);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Select Wildlife Portrait
            </h2>
            <p className="text-xs text-neutral-400">
              Choose from our high-resolution animal portraits or upload your own photo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Animals Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.map((animal) => {
              const isSelected = animal.id === currentAnimalId;
              return (
                <div
                  key={animal.id}
                  onClick={() => {
                    onSelectAnimal(animal);
                    onClose();
                  }}
                  className={`group relative flex flex-col rounded-xl overflow-hidden border bg-neutral-950 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-white ring-2 ring-white/20'
                      : 'border-neutral-800 hover:border-neutral-700 hover:scale-[1.01]'
                  }`}
                >
                  {/* Square thumbnail preview */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                    <img
                      src={animal.imageUrl}
                      alt={animal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white text-neutral-950 shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Card metadata (clean unboxed text per constitution) */}
                  <div className="p-3.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        {animal.name}
                      </h3>
                      <span className="text-[11px] font-mono text-neutral-500 italic">
                        {animal.species}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Compass className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate">{animal.habitat}</span>
                    </div>

                    <div className="flex items-start gap-1.5 mt-1 text-[11px] text-neutral-400 leading-relaxed">
                      <Info className="w-3 h-3 text-neutral-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{animal.fact}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom photo upload section */}
          <div className="pt-2 border-t border-neutral-800/80">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/40 text-neutral-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-neutral-400" />
              <span>Upload Custom Photo (Pet or Favorite Animal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
