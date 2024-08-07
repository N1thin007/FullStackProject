import React from 'react';
import './LearnMore.css';

const LearnMore = () => {
    const features = [
        {
            icon: "📅",
            title: "Smart Calendar",
            description: "Organize your tasks, events, and deadlines with our intelligent calendar that integrates with all your devices."
        },
        {
            icon: "🤖",
            title: "AI Integration",
            description: "Leverage AI to predict your schedule, suggest improvements, and automate repetitive tasks for maximum efficiency."
        },
        {
            icon: "📝",
            title: "Notes",
            description: "Take notes efficiently with our advanced text editor. Organize them with tags, categories, and easy search."
        },
        {
            icon: "✅",
            title: "To-Do List",
            description: "Keep track of your tasks with our robust to-do list feature that syncs across all your devices."
        },
        {
            icon: "⏳",
            title: "Pomodoro Timer",
            description: "Boost your productivity using the Pomodoro Technique, with customizable timers and break intervals."
        }
    ];

    return (
        <div className="chronoCraft-learnMore-container">
            <header className="chronoCraft-learnMore-header">
                <h1>Learn More About ChronoCraft</h1>
                <p>Discover the features that make ChronoCraft the ultimate productivity tool.</p>
            </header>

            <section className="chronoCraft-learnMore-features">
                {features.map((feature, index) => (
                    <div key={index} className="chronoCraft-learnMore-feature-card">
                        <div className="chronoCraft-learnMore-feature-icon">{feature.icon}</div>
                        <h2>{feature.title}</h2>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default LearnMore;