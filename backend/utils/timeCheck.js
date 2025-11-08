const isRegistrationOpen = () => {
    const currentDate = new Date();

    const startDate = new Date('2025-10-15T00:00:00');
    const endDate = new Date('2025-11-20T00:00:00');

    return (startDate <= currentDate && currentDate <= endDate);
};

module.exports  = { isRegistrationOpen };