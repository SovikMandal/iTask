import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ type, label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="w-full bg-transparent outline-none"
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                onClick={toggleShowPassword}
                size={22}
                className="text-primary cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={toggleShowPassword}
                size={22}
                className="text-slate-400 cursor-pointer"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
