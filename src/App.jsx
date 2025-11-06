import { useCallback, useRef, useState } from 'react'
import { Terms } from './components/Terms'
import { QueryBuilder } from './components/QueryBuilder'
import { Studies } from './components/Studies'
import { NiiViewer } from './components/NiiViewer'
import { useUrlQueryState } from './hooks/useUrlQueryState'
import './App.css'

export default function App() {
  const [query, setQuery] = useUrlQueryState('q')
  const [activeTab, setActiveTab] = useState('search')

  const handlePickTerm = useCallback((term) => {
    setQuery((q) => (q ? `${q} ${term}` : term))
  }, [setQuery])

  return (
    <div className="app">
      {/* 頁首 */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>LoTUS-BF</h1>
              <p>Location-or-Term Unified Search for Brain Functions</p>
            </div>
            
            <nav className="tabs">
              <button 
                className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                🔍 搜尋建構
              </button>
              <button 
                className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                📊 研究結果
              </button>
              <button 
                className={`tab ${activeTab === 'visualization' ? 'active' : ''}`}
                onClick={() => setActiveTab('visualization')}
              >
                🧠 腦圖視覺化
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="main">
        <div className="container">
          {/* 搜尋建構區塊 */}
          {activeTab === 'search' && (
            <div className="search-layout">
              {/* 術語面板 */}
              <div className="panel">
                <h2>可用術語庫</h2>
                <Terms onPickTerm={handlePickTerm} />
              </div>

              {/* 查詢建構器 */}
              <div className="panel query-builder">
                <h2>查詢建構器</h2>
                <QueryBuilder query={query} setQuery={setQuery} />
                
                <div className="quick-actions">
                  <h3>快速查詢範例</h3>
                  <div className="example-buttons">
                    {[
                      '[-22,-4,18] AND emotion',
                      'memory NOT visual', 
                      'prefrontal OR frontal'
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example)}
                        className="example-btn"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 結果和視覺化區塊 */}
          {(activeTab === 'results' || activeTab === 'visualization') && query && (
            <div className="results-layout">
              <div className={`results-panel ${activeTab === 'results' ? 'full-width' : ''}`}>
                <Studies query={query} />
              </div>
              
              {activeTab === 'visualization' && (
                <div className="visualization-panel">
                  <NiiViewer query={query} />
                </div>
              )}
            </div>
          )}

          {/* 空狀態提示 */}
          {!query && activeTab !== 'search' && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>開始您的搜尋</h3>
              <p>請在「搜尋建構」頁面建立查詢條件，即可查看相關的研究結果和腦圖視覺化</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}