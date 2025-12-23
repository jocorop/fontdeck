import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';

export const EyeFollower: React.FC = () => {
    const { accentColor } = useStore();
    const leftEyeRef = useRef<SVGSVGElement>(null);
    const rightEyeRef = useRef<SVGSVGElement>(null);
    const [leftPupilPos, setLeftPupilPos] = useState({ x: 0, y: 0 });
    const [rightPupilPos, setRightPupilPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const calculatePupilPos = (eye: SVGSVGElement) => {
                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const dx = e.clientX - eyeCenterX;
                const dy = e.clientY - eyeCenterY;
                const angle = Math.atan2(dy, dx);

                // Limit the pupil movement radius
                // Use a larger movement range for the "looking" effect within the card
                const maxRadius = 14;
                const dist = Math.min(maxRadius, Math.hypot(dx, dy) / 6);

                return {
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist
                };
            };

            if (leftEyeRef.current) {
                setLeftPupilPos(calculatePupilPos(leftEyeRef.current));
            }
            if (rightEyeRef.current) {
                setRightPupilPos(calculatePupilPos(rightEyeRef.current));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const Eye = ({ eyeRef, pupilPos }: { eyeRef: React.RefObject<SVGSVGElement | null>, pupilPos: { x: number, y: number } }) => (
        <svg ref={eyeRef} width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
            {/* Geometric Squircle Container (The "Card") */}
            <rect
                x="4" y="4"
                width="56" height="56"
                rx="16"
                fill="#181818"
                stroke="#333"
                strokeWidth="2"
            />

            {/* Tracking "Iris" - Soft Gradient Circle */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
                <circle cx="32" cy="32" r="10" fill={accentColor} opacity="0.8" />
                <circle cx="32" cy="32" r="6" fill="#fff" opacity="0.9" />
            </g>
        </svg>
    );

    return (
        <div className="flex gap-6 items-center justify-center pointer-events-none mb-4">
            <Eye eyeRef={leftEyeRef} pupilPos={leftPupilPos} />
            <Eye eyeRef={rightEyeRef} pupilPos={rightPupilPos} />
        </div>
    );
};
