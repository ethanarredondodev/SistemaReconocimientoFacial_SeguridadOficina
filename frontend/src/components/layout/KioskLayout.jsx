const KioskLayout = ({ children }) => {
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "#0f0f1a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
        }}>
            {children}
        </div>
    );
};

export default KioskLayout;