import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [anchors, setAnchors] = useState([
    { id: 1, title: 'Locked the front door', completed: false },
    { id: 2, title: 'Turned off the stove', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const addAnchor = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newAnchor = {
      id: Date.now(),
      title: inputValue,
      completed: false
    };
    setAnchors([newAnchor, ...anchors]);
    setInputValue('');
  };

  const markComplete = (id) => {
    setAnchors(anchors.map(a => a.id === id ? { ...a, completed: true } : a));
  };

  const deleteAnchor = (id) => {
    setAnchors(anchors.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-slate-900">Anchors</h1>
          <p className="text-slate-500 text-sm">Be present. Confirm once.</p>
        </header>

        {/* Input Section */}
        <form onSubmit={addAnchor} className="mb-8 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="New trigger (e.g. Iron unplugged)"
            className="flex-1 px-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          />
          <button type="submit" className="bg-white px-4 py-3 rounded-xl shadow-sm hover:bg-slate-100 transition-colors">
            ＋
          </button>
        </form>

        {/* List Section */}
        <div className="space-y-4">
          {anchors.map((anchor) => (
            <AnchorCard 
              key={anchor.id} 
              anchor={anchor} 
              onComplete={() => markComplete(anchor.id)} 
              onDelete={() => deleteAnchor(anchor.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AnchorCard = ({ anchor, onComplete, onDelete }) => {
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);

  const startHold = () => {
    if (anchor.completed) return;
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      onComplete();
      setIsHolding(false);
      if (window.navigator.vibrate) window.navigator.vibrate(50); // Haptic feedback
    }, 3000); // 3 seconds
  };

  const cancelHold = () => {
    setIsHolding(false);
    clearTimeout(timerRef.current);
  };

  return (
    <div className={`relative overflow-hidden bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all ${anchor.completed ? 'opacity-60' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg ${anchor.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {anchor.title}
        </h3>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-400 transition-colors text-xs">Remove</button>
      </div>

      {!anchor.completed ? (
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onMouseLeave={cancelHold}
          className="relative w-full py-4 bg-slate-50 rounded-xl overflow-hidden active:scale-[0.98] transition-transform select-none"
        >
          {/* Progress Bar Background */}
          <div 
            className={`absolute left-0 top-0 h-full bg-blue-100 transition-all ease-linear`}
            style={{ 
              width: isHolding ? '100%' : '0%', 
              transitionDuration: isHolding ? '3000ms' : '0ms' 
            }}
          />
          <span className="relative z-10 text-sm font-medium text-slate-500">
            {isHolding ? 'Hold steady...' : 'Hold 3s to Confirm'}
          </span>
        </button>
      ) : (
        <div className="w-full py-4 bg-green-50 text-green-600 rounded-xl text-center text-sm font-medium">
          ✓ Confirmed
        </div>
      )}
    </div>
  );
};

export default App;