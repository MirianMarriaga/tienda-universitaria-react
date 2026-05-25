export const categoryActions = {
    ADD_CATEGORY: 'ADD_CATEGORY',
    UPDATE_CATEGORY: 'UPDATE_CATEGORY',
}

export const categoryReducer = (state, action) => {
    switch (action.type) {
        case categoryActions.ADD_CATEGORY:
            return {
                ...state,
                categories: [
                    ...state.categories,
                    { id: crypto.randomUUID(), 
                        ...action.payload, 
                        createdAt: new Date().toISOString()
                    }
                ]
            }

        case categoryActions.UPDATE_CATEGORY:
            return {
                ...state,
                categories: state.categories.map(category =>
                    category.id === action.payload.id ? { ...category, ...action.payload } : category
                )
            }
        default:
            return state
    }
}