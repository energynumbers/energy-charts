import React, { useState, useRef, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import useMediaQuery from "./hooks/useMediaQuery";
import { Layout } from "./containers";
import { PageLoading, ChartsPage, Charts, Page } from "./components";

function App({ config }) {
  const [searchParams] = useSearchParams();
  const [mainScenario, setMainScenario] = useState(
    searchParams.get("scen1")
      ? searchParams.get("scen1")
      : config.defaultScenarioGroup
  );
  const [compareScenario, setCompareScenario] = useState(
    searchParams.get("scen2") ? searchParams.get("scen2") : null
  );
  const [showDifference, setShowDifference] = useState(
    searchParams.get("diff") ? searchParams.get("diff") : false
  );

  const cache = useRef({});

  const maxChartWidth = config.maxChartWidth ? config.maxChartWidth : 450;
  const applyMaxChartWidth = useMediaQuery(`(min-width: ${maxChartWidth}px)`);
  const chartWidth = applyMaxChartWidth ? maxChartWidth : 450;
  const chartWidthScaling = chartWidth / maxChartWidth;

  const titles = {
    chartsTitles: config.titles.charts,
    scenarioTitles: config.titles.scenarios,
    seriesTitles: config.titles.series
  };

  useEffect(() => {
    if (!compareScenario) {
      setShowDifference(false);
    }
  }, [compareScenario]);

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Layout {...config} />}>
          {config.landingPage ? (
            <Route
              index
              element={<Navigate to={config.landingPage} replace={true} />}
            />
          ) : (
            <Route
              index
              element={
                <Page cache={cache} basePath={config.basePath} name="index" />
              }
            />
          )}
          <Route
            path=":pageId"
            element={<Page cache={cache} basePath={config.basePath} />}
          />
          <Route
            path={config.chartsPath}
            element={
              <ChartsPage
                {...config}
                selectedScenarios={[mainScenario, compareScenario]}
                showDifference={showDifference}
                setMainScenario={setMainScenario}
                setCompareScenario={setCompareScenario}
                setShowDifference={setShowDifference}
              />
            }
          >
            <Route
              index
              element={<Navigate to={config.routes[0].path} replace={true} />}
            />
            {config.routes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                element={
                  route.charts && (
                    <Charts
                      selectedScenarios={[mainScenario, compareScenario]}
                      showDifference={showDifference}
                      basePath={config.basePath}
                      charts={route.charts}
                      chartsInfo={config.chartsInfo}
                      cache={cache}
                      xDomainPadding={config.xDomainPadding}
                      xGridValues={config.xGridValues}
                      xGridMarks={config.xGridMarks}
                      fixedDomain={config.fixedDomain}
                      chartWidth={chartWidth}
                      chartWidthScaling={chartWidthScaling}
                      stackbarOffset={config.stackbarOffset}
                      padding={config.chartPadding}
                      barWidth={config.barWidth}
                      {...titles}
                    />
                  )
                }
              >
                {route.routes && (
                  <>
                    <Route
                      index
                      element={
                        <Navigate to={route.routes[0].path} replace={true} />
                      }
                    />
                    {route.routes.map((route, idx) => (
                      <Route
                        key={idx}
                        path={route.path}
                        element={
                          route.charts && (
                            <Charts
                              selectedScenarios={[
                                mainScenario,
                                compareScenario
                              ]}
                              showDifference={showDifference}
                              basePath={config.basePath}
                              charts={route.charts}
                              chartsInfo={config.chartsInfo}
                              cache={cache}
                              xDomainPadding={config.xDomainPadding}
                              xGridValues={config.xGridValues}
                              xGridMarks={config.xGridMarks}
                              fixedDomain={config.fixedDomain}
                              chartWidth={chartWidth}
                              chartWidthScaling={chartWidthScaling}
                              stackbarOffset={config.stackbarOffset}
                              padding={config.chartPadding}
                              barWidth={config.barWidth}
                              {...titles}
                            />
                          )
                        }
                      />
                    ))}
                  </>
                )}
              </Route>
            ))}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
