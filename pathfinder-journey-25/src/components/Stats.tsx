export const Stats = () => {
  const stats = [
    {
      number: "10,000+",
      label: "Career Paths",
      description: "Comprehensive database of opportunities"
    },
    {
      number: "95%", 
      label: "Match Accuracy",
      description: "AI-powered career recommendations"
    },
    {
      number: "50,000+",
      label: "Success Stories", 
      description: "Real professionals sharing their journeys"
    },
    {
      number: "24/7",
      label: "Support Available",
      description: "Get guidance whenever you need it"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};