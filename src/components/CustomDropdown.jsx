// components/CustomDropdown.jsx
import React, { useState } from 'react';
import '../styles/CustomDropdown.css';

const CustomDropdown = ({ options, selected, onSelect, placeholder, isOptionDisabled = () => false }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (option, disabled) => {
    if (disabled) return;
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div
        className="selected"
        onClick={() => setOpen(!open)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected || placeholder}
      </div>
      {open && (
        <ul className="dropdown-menu" role="listbox" aria-label={placeholder || '옵션 목록'}>
          {options.map((option, idx) => {
            const disabled = !!isOptionDisabled(option);
            return (
              <li
                key={idx}
                role="option"
                aria-disabled={disabled}
                aria-selected={option === selected}
                className={`${option === selected ? 'selected-item' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => handleClick(option, disabled)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                    e.preventDefault();
                    handleClick(option, false);
                  }
                }}
                title={disabled ? '해당 옵션은 추천 대상이 아닙니다' : undefined}
                tabIndex={disabled ? -1 : 0}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
