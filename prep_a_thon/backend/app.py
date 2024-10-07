from flask import Flask,jsonify,request
from flask_cors import CORS 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
import random

from sklearn.linear_model import LinearRegression


app = Flask(__name__)
CORS(app)

data = pd.read_csv("Mock Data Prepathon.csv")



def first_function():
    global company_name, countr  # Declare as global

    company_name = input("Enter the name of the company: ")

    # Filter data for the entered company
    company_data = data[data['Company'] == company_name]

    if company_data.empty:
        print(f"Company '{company_name}' not found in the dataset.")
        return

    # Get unique list of countries where the company operates
    countries = company_data['Country'].unique()

    if len(countries) == 0:
        print(f"No countries found for the company '{company_name}'.")
        return

    # Display all countries where the company operates
    print(f"'{company_name}' operates in the following countries:")
    for idx, country in enumerate(countries, start=1):
        print(f"{idx}. {country}")

    # Ask the user to select a country
    country_choice = int(input("Select the country by entering the corresponding number: "))

    if country_choice < 1 or country_choice > len(countries):
        print("Invalid choice. Please try again.")
        return

    countr = countries[country_choice - 1]  # Assign selected country to the global variable

    print(f"Selected country: {countr}")

# A1: Count companies in a specific country
def count_companies_in_country():
    company_count = data[data['Country'] == countr]['Company'].count()
    return company_count

# A2: Companies with diversity score higher than a specified company in a country
def companies_with_higher_diversity():
    company_diversity = data[data['Company'] == company_name]['Diversity'].values
    if len(company_diversity) == 0:
        print(f"Company '{company_name}' not found.")
        return
    diversity_threshold = company_diversity[0]
    filtered_data = data[(data['Country'] == countr) & (data['Diversity'] > diversity_threshold)]
    company_count = filtered_data['Company'].count()
    # print(f"Number of companies in {countr} with diversity greater than {diversity_threshold}: {company_count}")
    return company_count

# A3: Compare stock price, market share, revenue, and expense for the year 2024
def compare_company_2024():
    company_data = data[(data['Company'] == company_name) & (data['Country'] == countr)]
    if company_data.empty:
        print(f"Company '{company_name}' not found in {countr}.")
        return

    def safe_numeric_conversion(value):
        try:
            return pd.to_numeric(value.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce')
        except:
            return np.nan

    stock_price = safe_numeric_conversion(company_data['Stock Price (2024)'].values[0])
    market_share = safe_numeric_conversion(company_data['Market share (2024)'].values[0])
    revenue = safe_numeric_conversion(company_data['Revenue (2024)'].values[0])
    expense = safe_numeric_conversion(company_data['Expense (2024)'].values[0])

    # Domestic comparisons (within the selected country)
    domestic_data = data[data['Country'] == countr]
    domestic_greater_stock_price = domestic_data[pd.to_numeric(domestic_data['Stock Price (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > stock_price].shape[0] if pd.notna(stock_price) else "N/A"
    domestic_greater_market_share = domestic_data[pd.to_numeric(domestic_data['Market share (2024)'], errors='coerce') > market_share].shape[0] if pd.notna(market_share) else "N/A"
    domestic_greater_revenue = domestic_data[pd.to_numeric(domestic_data['Revenue (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > revenue].shape[0] if pd.notna(revenue) else "N/A"
    domestic_greater_expense = domestic_data[pd.to_numeric(domestic_data['Expense (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > expense].shape[0] if pd.notna(expense) else "N/A"

    # Global comparisons (all companies)
    global_greater_stock_price = data[pd.to_numeric(data['Stock Price (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > stock_price].shape[0] if pd.notna(stock_price) else "N/A"
    global_greater_market_share = data[pd.to_numeric(data['Market share (2024)'], errors='coerce') > market_share].shape[0] if pd.notna(market_share) else "N/A"
    global_greater_revenue = data[pd.to_numeric(data['Revenue (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > revenue].shape[0] if pd.notna(revenue) else "N/A"
    global_greater_expense = data[pd.to_numeric(data['Expense (2024)'].str.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce') > expense].shape[0] if pd.notna(expense) else "N/A"

    # Output results
    print("Domestic Comparison Results:")
    print(f"Greater Stock Price: {domestic_greater_stock_price}")
    print(f"Greater Market Share: {domestic_greater_market_share}")
    print(f"Greater Revenue: {domestic_greater_revenue}")
    print(f"Greater Expense: {domestic_greater_expense}")

    print("\nGlobal Comparison Results:")
    print(f"Greater Stock Price: {global_greater_stock_price}")
    print(f"Greater Market Share: {global_greater_market_share}")
    print(f"Greater Revenue: {global_greater_revenue}")
    print(f"Greater Expense: {global_greater_expense}")

    lis = [domestic_greater_stock_price,domestic_greater_market_share,domestic_greater_revenue,domestic_greater_expense,global_greater_stock_price,global_greater_market_share,global_greater_revenue,global_greater_expense]

    return lis





# A4: Plot year-wise values for a company
def plot_company_data():
    company_data = data[(data['Company'] == company_name) & (data['Country'] == countr)]
    if company_data.empty:
        print(f"Company '{company_name}' not found in {countr}.")
        return

    years = list(range(2015, 2025))
    metrics = {'Stock Price': [], 'Revenue': [], 'Market Share': [], 'Expense': []}

    for year in years:
        stock_price_col = f'Stock Price ({year})'
        revenue_col = f'Revenue ({year})'
        market_share_col = f'Market share ({year})'
        expense_col = f'Expense ({year})'

        if revenue_col in company_data.columns:
            revenue = company_data[revenue_col].values[0]
            metrics['Revenue'].append((year, pd.to_numeric(revenue.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce')))

        if stock_price_col in company_data.columns:
            stock_price = company_data[stock_price_col].values[0]
            if isinstance(stock_price, str):
                stock_price = stock_price.strip().replace('$', '').replace(',', '')
                if 'M' in stock_price:
                    stock_price = float(stock_price.replace('M', '').strip()) * 1_000_000
                elif 'B' in stock_price:
                    stock_price = float(stock_price.replace('B', '').strip()) * 1_000_000_000
            numeric_stock_price = pd.to_numeric(stock_price, errors='coerce')
            metrics['Stock Price'].append((year, numeric_stock_price))

        if market_share_col in company_data.columns:
            market_share = company_data[market_share_col].values[0]
            metrics['Market Share'].append((year, pd.to_numeric(market_share, errors='coerce')))

        if expense_col in company_data.columns:
            expense = company_data[expense_col].values[0]
            metrics['Expense'].append((year, pd.to_numeric(expense.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce')))

    for metric_name, values in metrics.items():
        values = [(year, val) for year, val in values if not np.isnan(val)]
        if not values:
            continue
        years, metric_values = zip(*values)
        plt.figure(figsize=(10, 6))
        plt.plot(years, metric_values, marker='o', linestyle='-', label=f'{metric_name} vs Year')
        plt.title(f'{metric_name} for {company_name} (2015-2024)')
        plt.xlabel('Year')
        plt.ylabel(metric_name)
        plt.xticks(years)
        plt.grid(True)
        plt.legend()
        plt.tight_layout()
        plt.show()




# A5: Analyze company growth, stability, and provide statistical data
comments_database = {
    'stock_price': {
        'positive_growth': [
            "The stock price has shown impressive growth, reflecting strong investor confidence.",
            "A significant increase in stock price suggests positive market sentiment towards the company.",
            "The upward trend in stock prices indicates a solid performance and future potential."
        ],
        'negative_growth': [
            "The decline in stock price raises concerns about investor confidence.",
            "A downward trend in stock prices may indicate challenges in the company's performance.",
            "The recent drop in stock price suggests potential market skepticism."
        ]
    },
    'revenue': {
        'positive_growth': [
            "The company is achieving robust revenue growth, indicating effective sales strategies.",
            "Increased revenue reflects the company's strong market presence and demand.",
            "The upward revenue trend signifies successful operational efficiencies."
        ],
        'negative_growth': [
            "Revenue contraction may indicate underlying issues that need addressing.",
            "A decrease in revenue suggests a potential loss of market competitiveness.",
            "The decline in revenue is concerning and warrants further investigation."
        ]
    },
    'market_share': {
        'positive_growth': [
            "Growing market share highlights the company's competitive advantages.",
            "An increase in market share signals effective business strategies.",
            "The company is successfully capturing more of the market."
        ],
        'negative_growth': [
            "A decline in market share could signify competitive pressures.",
            "Decreasing market share suggests potential challenges in retaining customers.",
            "Loss of market share may indicate a need for strategic reassessment."
        ]
    },
    'expenses': {
        'controlled': [
            "The company has effectively managed its expenses, indicating operational efficiency.",
            "Stable expense growth reflects prudent financial management.",
            "Effective cost control measures are evident from the expense trend."
        ],
        'uncontrolled': [
            "Rising expenses may pose a threat to profitability if not addressed.",
            "An alarming increase in expenses could impact overall financial health.",
            "Uncontrolled expense growth raises concerns about operational efficiency."
        ]
    },
    'stability': {
        'stable': "The company's performance metrics are stable, indicating consistent management.",
        'volatile': "Volatile performance metrics may suggest risks in the company's operations."
    }
}

def analyze_company_growth():
    # Extract the company's data based on global variables
    company_data = data[(data['Company'] == company_name) & (data['Country'] == countr)]

    # Check if the company exists in the specified country
    if company_data.empty:
        return f"Company '{company_name}' not found in {countr}."

    # Initialize variables to hold growth data
    stock_prices = []
    revenues = []
    market_shares = []
    expenses = []

    # Define years for analysis
    years = list(range(2015, 2025))

    # Collect data for the years
    for year in years:
        stock_price_col = f'Stock Price ({year})'
        revenue_col = f'Revenue ({year})'
        market_share_col = f'Market share ({year})'
        expense_col = f'Expense ({year})'

        if stock_price_col in company_data.columns:
            stock_price = company_data[stock_price_col].values[0]
            if isinstance(stock_price, str):
                # Clean up the stock price value
                stock_price = stock_price.strip()  # Remove any leading/trailing whitespace
                # Replace dollar sign and commas
                stock_price = stock_price.replace('$', '').replace(',', '')
                # Convert 'M' and 'B' to numeric values
                if 'M' in stock_price:
                    stock_price = float(stock_price.replace('M', '').strip()) * 1_000_000  # Convert millions
                elif 'B' in stock_price:
                    stock_price = float(stock_price.replace('B', '').strip()) * 1_000_000_000  # Convert billions

            # Convert to numeric, handle NaN
            numeric_stock_price = pd.to_numeric(stock_price, errors='coerce')
            stock_prices.append(numeric_stock_price)

        if revenue_col in company_data.columns:
            revenue = company_data[revenue_col].values[0]
            revenues.append(pd.to_numeric(revenue.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce'))

        if market_share_col in company_data.columns:
            market_share = company_data[market_share_col].values[0]
            market_shares.append(pd.to_numeric(market_share, errors='coerce'))

        if expense_col in company_data.columns:
            expense = company_data[expense_col].values[0]
            expenses.append(pd.to_numeric(expense.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce'))

    # Convert lists to pandas Series, handling NaN values
    stock_prices = pd.Series(stock_prices).dropna()
    revenues = pd.Series(revenues).dropna()
    market_shares = pd.Series(market_shares).dropna()
    expenses = pd.Series(expenses).dropna()

    # Calculate growth rates (percentage change)
    stock_price_growth = stock_prices.pct_change().dropna() * 100
    revenue_growth = revenues.pct_change().dropna() * 100
    market_share_growth = market_shares.pct_change().dropna() * 100
    expense_growth = expenses.pct_change().dropna() * 100

    # Calculate stability (standard deviation)
    stability = {
        'Stock Price Stability': stock_price_growth.std(),
        'Revenue Stability': revenue_growth.std(),
        'Market Share Stability': market_share_growth.std(),
        'Expense Stability': expense_growth.std()
    }

    # Generate comments based on growth and stability
    comments = [stock_prices.mean(),revenues.mean(),market_shares.mean(),expenses.mean(),stock_price_growth.mean(),revenue_growth.mean(),market_share_growth.mean(),expense_growth.mean()]  # Use a list to store comments

    # Statistical data summary
    stats_summary = {
        'Average Stock Price': stock_prices.mean(),
        'Average Revenue': revenues.mean(),
        'Average Market Share': market_shares.mean(),
        'Average Expense': expenses.mean(),
        'Stock Price Growth (%)': stock_price_growth.mean(),
        'Revenue Growth (%)': revenue_growth.mean(),
        'Market Share Growth (%)': market_share_growth.mean(),
        'Expense Growth (%)': expense_growth.mean()
    }

    # # Constructing professional comments
    # comments.append(f"**Statistical Overview for {company_name} in {countr}:**")

    # # Handle NaN values in the statistical summary for output
    # comments.append(f"1. Average Stock Price: ${stats_summary['Average Stock Price']:.2f}" if pd.notna(stats_summary['Average Stock Price']) else "1. Average Stock Price: Data not available.")
    # comments.append(f"2. Average Revenue: ${stats_summary['Average Revenue']:.2f}" if pd.notna(stats_summary['Average Revenue']) else "2. Average Revenue: Data not available.")
    # comments.append(f"3. Average Market Share: {stats_summary['Average Market Share']:.2f}%" if pd.notna(stats_summary['Average Market Share']) else "3. Average Market Share: Data not available.")
    # comments.append(f"4. Average Expense: ${stats_summary['Average Expense']:.2f}" if pd.notna(stats_summary['Average Expense']) else "4. Average Expense: Data not available.")
    # comments.append(f"5. Stock Price Growth: {stats_summary['Stock Price Growth (%)']:.2f}%" if pd.notna(stats_summary['Stock Price Growth (%)']) else "5. Stock Price Growth: Data not available.")
    # comments.append(f"6. Revenue Growth: {stats_summary['Revenue Growth (%)']:.2f}%" if pd.notna(stats_summary['Revenue Growth (%)']) else "6. Revenue Growth: Data not available.")
    # comments.append(f"7. Market Share Growth: {stats_summary['Market Share Growth (%)']:.2f}%" if pd.notna(stats_summary['Market Share Growth (%)']) else "7. Market Share Growth: Data not available.")
    # comments.append(f"8. Expense Growth: {stats_summary['Expense Growth (%)']:.2f}%" if pd.notna(stats_summary['Expense Growth (%)']) else "8. Expense Growth: Data not available.")

    # Growth and stability comments based on statistical data
    if stats_summary['Stock Price Growth (%)'] > 0:
        comments.append(np.random.choice(comments_database['stock_price']['positive_growth']))
    else:
        comments.append(np.random.choice(comments_database['stock_price']['negative_growth']))

    if stats_summary['Revenue Growth (%)'] > 0:
        comments.append(np.random.choice(comments_database['revenue']['positive_growth']))
    else:
        comments.append(np.random.choice(comments_database['revenue']['negative_growth']))

    if stats_summary['Market Share Growth (%)'] > 0:
        comments.append(np.random.choice(comments_database['market_share']['positive_growth']))
    else:
        comments.append(np.random.choice(comments_database['market_share']['negative_growth']))

    if stats_summary['Expense Growth (%)'] < 0:
        comments.append(np.random.choice(comments_database['expenses']['controlled']))
    else:
        comments.append(np.random.choice(comments_database['expenses']['uncontrolled']))

    return comments






# A6: Train and save linear regression model

# Function to train models and output predictions for future values
def train_and_savemodel(company_name):
    # Suppress warnings
    warnings.filterwarnings("ignore", category=UserWarning)

    # Extract the company's data
    company_data = data[data['Company'] == company_name]

    # Check if the company exists
    if company_data.empty:
        return f"Company '{company_name}' not found."

    # Initialize lists to hold historical data
    years = list(range(2015, 2025))
    stock_prices = []
    revenues = []
    market_shares = []
    expenses = []

    # Collect historical data for the years
    for year in years:
        stock_price_col = f'Stock Price ({year})'
        revenue_col = f'Revenue ({year})'
        market_share_col = f'Market share ({year})'
        expense_col = f'Expense ({year})'

        if stock_price_col in company_data.columns:
            stock_price = company_data[stock_price_col].values[0]
            if isinstance(stock_price, str):
                # Clean up the stock price value
                stock_price = stock_price.strip()  # Remove any leading/trailing whitespace
                # Replace dollar sign and commas
                stock_price = stock_price.replace('$', '').replace(',', '')
                # Convert 'M' and 'B' to numeric values
                if 'M' in stock_price:
                    stock_price = float(stock_price.replace('M', '').strip()) * 1_000_000  # Convert millions
                elif 'B' in stock_price:
                    stock_price = float(stock_price.replace('B', '').strip()) * 1_000_000_000  # Convert billions

            # Convert to numeric, handle NaN
            numeric_stock_price = pd.to_numeric(stock_price, errors='coerce')
            stock_prices.append(numeric_stock_price)

        if revenue_col in company_data.columns:
            revenue = company_data[revenue_col].values[0]
            revenues.append(pd.to_numeric(revenue.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce'))

        if market_share_col in company_data.columns:
            market_share = company_data[market_share_col].values[0]
            market_shares.append(pd.to_numeric(market_share, errors='coerce'))

        if expense_col in company_data.columns:
            expense = company_data[expense_col].values[0]
            expenses.append(pd.to_numeric(expense.replace('$', '').replace('B', 'e9').replace('M', 'e6'), errors='coerce'))

    # Convert lists to DataFrame for regression analysis
    historical_data = pd.DataFrame({
        'Year': years,
        'Stock Price': stock_prices,
        'Revenue': revenues,
        'Market Share': market_shares,
        'Expense': expenses
    }).dropna()

    # Prepare data for prediction
    X = historical_data[['Revenue', 'Market Share', 'Expense']]
    y_stock = historical_data['Stock Price']
    y_revenue = historical_data['Revenue']
    y_market_share = historical_data['Market Share']
    y_expense = historical_data['Expense']

    # Fit regression models
    stock_model = LinearRegression().fit(X, y_stock)
    revenue_model = LinearRegression().fit(X, y_revenue)
    market_share_model = LinearRegression().fit(X, y_market_share)
    expense_model = LinearRegression().fit(X, y_expense)

    # Predict the next year (2025)
    next_year = np.array([[historical_data['Revenue'].mean(), historical_data['Market Share'].mean(), historical_data['Expense'].mean()]])

    predicted_stock_price = stock_model.predict(next_year)[0]
    predicted_revenue = revenue_model.predict(next_year)[0]
    predicted_market_share = market_share_model.predict(next_year)[0]
    predicted_expense = expense_model.predict(next_year)[0]

    print("Predicted Stock Price (2025):", predicted_stock_price)
    print("Predicted Revenue (2025):", predicted_revenue)
    print("Predicted Market Share (2025):", predicted_market_share)
    print("Predicted Expense (2025):", predicted_expense)

    return [predicted_stock_price,predicted_revenue,predicted_market_share,predicted_expense]

# Initialize global variables


@app.route('/submit', methods=['POST'])
def submit():
    global company_name, countr
    data = request.json
    company_name = data.get('companyName')
    countr = data.get('countryName')
    print(f"Company: {company_name}, Country: {countr}")
    response_data = {
        "message": "Data received successfully!",
        "company": company_name,
        "country": countr
    }
    print(response_data)
    return jsonify(response_data)
    

@app.route("/search", methods = ['GET'])
def new_company():
    # global company_name, countr
    # company_name = "Zooxo"
    # countr ="Brazil"
    company_data = data[data['Company'] == company_name] 
    if company_data.empty:
        return jsonify({"error": f"Company '{company_name}' not found in the dataset."}), 404  
    countries = company_data['Country'].unique() 
    # count_company = count_companies_in_country()
    comments = analyze_company_growth()
    message = train_and_savemodel(company_name)
    # diversity = 
    diversity = str(companies_with_higher_diversity())
    count_company = str(count_companies_in_country())

    compare_company = compare_company_2024()
    datas = {"countries": countries.tolist(),"growth": comments,"Trained": message,"compare":compare_company,"diversity": diversity, "count_companies":count_company}
    return jsonify(datas)

@app.route('/select_company', methods=['POST'])
def select_company():
    global company_name, countr

    # Get the company name from the request
    company_name = request.json.get('company_name')
    company_data = data[data['Company'] == company_name]

    if company_data.empty:
        return jsonify({"error": f"Company '{company_name}' not found in the dataset."}), 404

    # Get unique countries
    countries = company_data['Country'].unique()
    return jsonify({"countries": countries.tolist()}), 200

@app.route('/select_country', methods=['POST'])
def select_country():
    global countr

    # Get the selected country from the request
    countr = request.json.get('country')

    # Count companies in the selected country
    company_count = count_companies_in_country()
    return jsonify({"company_count": company_count}), 200

@app.route('/analyze_growth', methods=['POST'])
def analyze_growth():
    comments = analyze_company_growth()
    return jsonify({"comments": comments}), 200

@app.route('/train_model', methods=['POST'])
def train_model():
    global company_name
    message = train_and_savemodel(company_name)
    return jsonify({"message": message}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0' ,debug=True)