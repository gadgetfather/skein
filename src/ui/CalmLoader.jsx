import React from 'react';

export default function CalmLoader({ label='weaving a clearer path…', detail='holding your place while Skein thinks' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center rounded-[16px_12px_17px_13px] border-[1.5px] border-[rgba(122,154,111,.55)] bg-[rgba(251,251,250,.96)] px-7 py-5 text-center shadow-[4px_5px_0_rgba(58,64,69,.12)]">
      <svg aria-hidden="true" width="112" height="36" viewBox="0 0 112 36" className="mb-2 overflow-visible">
        <path d="M4 20 C22 4, 34 32, 52 17 S84 5, 108 19" fill="none" stroke="#7a9a6f" strokeWidth="2" strokeLinecap="round" strokeDasharray="9 7" className="animate-[threadFlow_2.8s_ease-in-out_infinite]"/>
        {[18,56,94].map((cx,index)=><circle key={cx} cx={cx} cy={index===1?17:19} r="4.5" fill="#edf0f1" stroke="#7a9a6f" strokeWidth="1.5" className="animate-[breathe_2.4s_ease-in-out_infinite]" style={{animationDelay:`${index*.35}s`}}/>)}
      </svg>
      <span className="font-hand text-[21px] font-bold leading-none text-ink">{label}</span>
      <span className="mt-1.5 text-[10px] text-muted-2">{detail}</span>
      <span className="sr-only">Loading</span>
    </div>
  );
}
