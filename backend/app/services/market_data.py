import yfinance as yf
import pandas as pd
from typing import List, Dict

def fetch_historical_data(tickers: List[str], period: str = "2y") -> pd.DataFrame:
    """
    Fetches historical adjusted close prices for the given tickers.
    """
    if not tickers:
        return pd.DataFrame()
    
    try:
        # Download data for all tickers
        if len(tickers) == 1:
            # For single ticker, download directly
            ticker_obj = yf.Ticker(tickers[0])
            data = ticker_obj.history(period=period)
            if 'Close' in data.columns:
                data = data[['Close']].rename(columns={'Close': tickers[0]})
            else:
                raise ValueError(f"No price data available for {tickers[0]}")
        else:
            # For multiple tickers
            data = yf.download(tickers, period=period, progress=False, group_by='ticker')
            
            # Extract Close prices for each ticker
            close_data = {}
            for ticker in tickers:
                try:
                    if ticker in data.columns.get_level_values(0):
                        close_data[ticker] = data[ticker]['Close']
                    else:
                        # Fallback: try direct column access
                        close_data[ticker] = data['Close'][ticker] if 'Close' in data.columns.get_level_values(0) else data[ticker]
                except Exception as e:
                    print(f"Error extracting data for {ticker}: {e}")
                    # Try alternative approach
                    ticker_obj = yf.Ticker(ticker)
                    hist = ticker_obj.history(period=period)
                    if not hist.empty and 'Close' in hist.columns:
                        close_data[ticker] = hist['Close']
            
            data = pd.DataFrame(close_data)
        
        # Drop any NaN rows
        data = data.dropna()
        
        return data
    except Exception as e:
        print(f"Error in fetch_historical_data: {e}")
        raise Exception(f"Error fetching data: {str(e)}")

def get_sector_info(tickers: List[str]) -> Dict[str, str]:
    """
    Fetches sector information for each ticker.
    """
    sector_map = {}
    for ticker in tickers:
        try:
            info = yf.Ticker(ticker).info
            sector_map[ticker] = info.get('sector', 'Unknown')
        except Exception as e:
            print(f"Error fetching info for {ticker}: {e}")
            sector_map[ticker] = 'Unknown'
    return sector_map

def get_benchmark_data(period: str = "2y") -> pd.Series:
    """
    Fetches S&P 500 data to calculate Beta.
    """
    try:
        spy = yf.Ticker("SPY")
        hist = spy.history(period=period)
        
        if hist.empty:
            raise ValueError("No benchmark data available")
        
        # Return Close prices as Series
        return hist['Close']
    except Exception as e:
        print(f"Error fetching benchmark data: {e}")
        raise Exception(f"Error fetching benchmark: {str(e)}")
