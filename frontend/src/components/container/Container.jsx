import tw from '../../utils/tailwindUtil'

const Container = ({ children, className }) => {
    return (
        <div className={tw("w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8", className)}>
            {children}
        </div>
    )
}

export default Container;