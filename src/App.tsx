import "./App.css";
import "./index.css";
import DemoDataTable from "./pages/demo-datatable";
import { useMediaQuery } from "react-responsive";
import { MediaInfoContext } from "./contexts/MediaInfo";

const App = () => {
  const useDesktopMediaQuery = () => useMediaQuery({ minWidth: 1280 });

  const useTabletMediaQuery = () => useMediaQuery({ minWidth: 768, maxWidth: 1279 });

  const useMobileMediaQuery = () => useMediaQuery({ maxWidth: 767 });

  const isDesktop = useDesktopMediaQuery();
  const isTablet = useTabletMediaQuery();
  const isMobile = useMobileMediaQuery();

  return (
    <div className="App">
      <MediaInfoContext.Provider value={{ isDesktop, isTablet, isMobile }}>
        <DemoDataTable />
      </MediaInfoContext.Provider>
    </div>
  );
};

export default App;
