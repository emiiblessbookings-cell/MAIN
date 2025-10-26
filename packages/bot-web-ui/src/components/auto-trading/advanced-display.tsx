"use client"

import { useState } from "react"
import "./advanced-display.scss"

const AdvancedDisplay = () => {
  const [isAutoTrading, setIsAutoTrading] = useState(false)
  const [tradingSettings, setTradingSettings] = useState({
    maxTrades: 10,
    stopLoss: 5,
    takeProfit: 10,
    tradeAmount: 1,
  })
  const [tradingStatus, setTradingStatus] = useState("Stopped")
  const [activeStrategies, setActiveStrategies] = useState([])

  const handleStartAutoTrading = () => {
    setIsAutoTrading(true)
    setTradingStatus("Running")
    // Add your automated trading logic here
    console.log("[v0] Auto trading started with settings:", tradingSettings)
  }

  const handleStopAutoTrading = () => {
    setIsAutoTrading(false)
    setTradingStatus("Stopped")
    console.log("[v0] Auto trading stopped")
  }

  const handleSettingChange = (setting, value) => {
    setTradingSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  return (
    <div className="advanced-display">
      <div className="trading-controls">
        <h3>Automated Trading Controls</h3>

        <div className="control-section">
          <div className="status-indicator">
            <span className={`status ${isAutoTrading ? "active" : "inactive"}`}>Status: {tradingStatus}</span>
          </div>

          <div className="action-buttons">
            <button className="start-btn" onClick={handleStartAutoTrading} disabled={isAutoTrading}>
              Start Auto Trading
            </button>
            <button className="stop-btn" onClick={handleStopAutoTrading} disabled={!isAutoTrading}>
              Stop Auto Trading
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h4>Trading Parameters</h4>

          <div className="setting-group">
            <label>Max Trades per Session:</label>
            <input
              type="number"
              value={tradingSettings.maxTrades}
              onChange={(e) => handleSettingChange("maxTrades", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label>Stop Loss (%):</label>
            <input
              type="number"
              value={tradingSettings.stopLoss}
              onChange={(e) => handleSettingChange("stopLoss", Number.parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label>Take Profit (%):</label>
            <input
              type="number"
              value={tradingSettings.takeProfit}
              onChange={(e) => handleSettingChange("takeProfit", Number.parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label>Trade Amount:</label>
            <input
              type="number"
              step="0.1"
              value={tradingSettings.tradeAmount}
              onChange={(e) => handleSettingChange("tradeAmount", Number.parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="strategy-section">
          <h4>Active Strategies</h4>
          <div className="strategy-list">
            {activeStrategies.length === 0 ? (
              <p>No active strategies. Create strategies in Bot Builder.</p>
            ) : (
              activeStrategies.map((strategy, index) => (
                <div key={index} className="strategy-item">
                  {strategy.name}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedDisplay
