import pandas as pd
import io
import numpy as np

def analyze_csv(file_content: bytes):
    try:
        # Load CSV
        df = pd.read_csv(io.BytesIO(file_content))
        
        if df.empty or len(df.columns) == 0:
            raise ValueError("CSV is empty or has no columns.")
            
        rows, columns = df.shape
        missing_values = int(df.isnull().sum().sum())
        duplicate_rows = int(df.duplicated().sum())
        
        # Column info
        columns_info = []
        statistics = []
        
        for col in df.columns:
            col_type = str(df[col].dtype)
            col_missing = int(df[col].isnull().sum())
            col_unique = int(df[col].nunique())
            
            columns_info.append({
                "name": col,
                "type": col_type,
                "missing": col_missing,
                "unique": col_unique
            })
            
            # Statistics based on column type
            if pd.api.types.is_numeric_dtype(df[col]):
                col_min = float(df[col].min()) if not pd.isna(df[col].min()) else None
                col_max = float(df[col].max()) if not pd.isna(df[col].max()) else None
                col_mean = float(df[col].mean()) if not pd.isna(df[col].mean()) else None
                col_std = float(df[col].std()) if not pd.isna(df[col].std()) else None
                col_count = int(df[col].count())
                
                statistics.append({
                    "column": col,
                    "type": "numeric",
                    "count": col_count,
                    "mean": col_mean,
                    "min": col_min,
                    "max": col_max,
                    "std": col_std
                })
            else:
                col_count = int(df[col].count())
                if col_count > 0:
                    most_common = df[col].mode()[0] if not df[col].mode().empty else None
                    if most_common is not None:
                        most_common_str = str(most_common)
                        frequency = int((df[col] == most_common).sum())
                    else:
                        most_common_str = None
                        frequency = 0
                else:
                    most_common_str = None
                    frequency = 0
                
                statistics.append({
                    "column": col,
                    "type": "categorical",
                    "unique": col_unique,
                    "most_common": most_common_str,
                    "frequency": frequency
                })
                
        # Preview Data - first 10 rows
        # Replace NaNs with None for JSON serialization
        df_preview = df.head(10).replace({np.nan: None})
        preview = df_preview.to_dict(orient="records")
        
        # Missing values breakdown
        missing_breakdown = df.isnull().sum().to_dict()
        
        return {
            "rows": rows,
            "columns": columns,
            "missing_values": missing_values,
            "duplicate_rows": duplicate_rows,
            "columns_info": columns_info,
            "statistics": statistics,
            "missing_breakdown": missing_breakdown,
            "preview": preview,
            "all_data": df.replace({np.nan: None}).to_dict(orient="records") # For charts
        }
    except Exception as e:
        raise ValueError(f"Failed to process CSV: {str(e)}")
