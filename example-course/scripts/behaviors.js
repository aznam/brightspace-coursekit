window.CourseKitBehaviors = {
    ...(window.CourseKitBehaviors || {}),

    announce: async (element, xml) => {
        element.dataset.initialized = 'true';
        return () => {};
    }
};