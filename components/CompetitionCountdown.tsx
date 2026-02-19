"use client";

import { useState, useEffect } from "react";

interface CountdownLabels {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

interface CompetitionCountdownProps {
    targetDate: string;
    labels: CountdownLabels;
}

function getTimeLeft(targetDate: string) {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function CompetitionCountdown({
    targetDate,
    labels,
}: CompetitionCountdownProps) {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const units = [
        { value: timeLeft.days, label: labels.days },
        { value: timeLeft.hours, label: labels.hours },
        { value: timeLeft.minutes, label: labels.minutes },
        { value: timeLeft.seconds, label: labels.seconds },
    ];

    return (
        <div className="comp-countdown">
            {units.map((unit, i) => (
                <div key={i} className="comp-countdown-unit">
                    <div className="comp-countdown-number">
                        {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="comp-countdown-label-unit">{unit.label}</div>
                </div>
            ))}
        </div>
    );
}
