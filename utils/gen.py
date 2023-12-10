#!/usr/bin/env python3

import secrets
from random import randint
from faker import Faker
import sqlite3
import argparse


class Account:
    def __init__(self) -> None:
        self.banks: list[str] = [
            "Chase",
            "Bank of America",
            "Wells Fargo",
            "Barclays",
            "Santander",
            "Citi",
        ]
        self.account_type: list[str] = ["Saving", "Checking"]

        self.account_id: str = secrets.token_hex(15)
        self.routing_number: int = randint(1e7, 1e8 - 1)
        self.account_name: str = f"{self.banks[randint(0, len(self.banks)) - 1]} {self.account_type[randint(0, len(self.account_type) - 1)]}"
        self.account_subtype: str = self.account_type[
            randint(0, len(self.account_type) - 1)
        ].lower()
        self.account_balance: int = randint(0, 1e5 - 1)
        self.account_limit: int = randint(0, 1e4 - 1)

    def output(self) -> str:
        return f"{self.account_id} {self.routing_number} {self.account_name} {self.account_subtype} {self.account_balance} {self.account_limit}"

    def post(self, db_cursor) -> None:
        db_cursor.execute(
            f"""INSERT INTO accounts VALUES (
                '{self.account_id}',
                '{self.routing_number}',
                '{self.account_name}',
                '{self.account_subtype}',
                '{self.account_balance}',
                '{self.account_limit}'
            )"""
        )


class Transactions:
    def __init__(self, account: Account) -> None:
        categories = self.parse_categories("./categories.csv")
        fake = Faker()

        primary_categories: list[str] = list(categories.keys())

        payment_channel: list[str] = [
            "online",
            "in-store",
        ]

        self.transaction_id: str = secrets.token_hex(15)
        self.account_id: str = account.account_id
        self.account_name: str = account.account_name
        self.category_primary: str = primary_categories[
            randint(0, len(primary_categories) - 1)
        ]
        self.category_detailed: str = categories[self.category_primary][
            randint(0, len(categories[self.category_primary]) - 1)
        ]
        self.merchant_name: str = fake.company()
        self.store_number: int = randint(0, 1e3 - 1)
        self.logo_url: str = None
        self.transaction_amount: float = randint(1, 1e3 - 1)
        self.address: str = fake.address().split("\n")[0]
        self.city: str = fake.city()
        self.region: str = fake.state()
        self.postal_code: str = str(randint(1e4, 1e5 - 1))
        self.country: str = "US"
        self.datetime: str = fake.date_time_between(
            start_date="-1y", end_date="now", tzinfo=None
        ).strftime("%Y-%m-%d %H:%M:%S")
        self.payment_channel: str = payment_channel[
            randint(0, len(payment_channel) - 1)
        ]
        self.cursor: str = None
        self.next_cursor: str = None

    def output(self) -> str:
        return f"{self.transaction_id} {self.account_id} {self.account_name} {self.category_primary} {self.category_detailed} {self.merchant_name} {self.store_number} {self.logo_url} {self.transaction_amount} {self.address} {self.city} {self.region} {self.postal_code} {self.country} {self.datetime} {self.payment_channel} {self.cursor} {self.next_cursor}"

    def post(self, db_cursor) -> None:
        db_cursor.execute(
            f"""INSERT INTO transactions VALUES (
                '{self.transaction_id}',
                '{self.account_id}',
                '{self.account_name}',
                '{self.category_primary}',
                '{self.category_detailed}',
                '{self.merchant_name}',
                '{self.store_number}',
                '{self.logo_url}',
                '{self.transaction_amount}',
                '{self.address}',
                '{self.city}',
                '{self.region}',
                '{self.postal_code}',
                '{self.country}',
                '{self.datetime}',
                '{self.payment_channel}',
                '{self.cursor}',
                '{self.next_cursor}'
            )"""
        )

    def parse_categories(self, url) -> dict:
        f = open(url)

        line: str = f.readline()
        data: list[str] = f.readlines()

        categories: dict = dict()

        for line in data:
            line: str = line.strip()
            line: list[str] = line.split(",")

            for i in range(len(line)):
                line[i] = line[i].strip().lower().replace("_", " ")

            if line[0] not in categories:
                categories[line[0]] = list()

            categories[line[0]].append(line[1])

        return categories


def init_db(filename: str):
    conn = sqlite3.connect(filename)

    # generate accounts and transactions table if does not exist
    conn.execute(
        """CREATE TABLE IF NOT EXISTS Accounts (
                account_id VARCHAR(256) NOT NULL,
                routing_number INTEGER NOT NULL,
                account_name VARCHAR(256),
                account_subtype VARCHAR(256),
                account_balance DECIMAL(10,2) NOT NULL,
                account_limit DECIMAL(10,2),
                PRIMARY KEY (account_id)
            );
        """
    )

    conn.execute(
        """CREATE TABLE IF NOT EXISTS Transactions (
                transaction_id VARCHAR(256) NOT NULL,
                account_id VARCHAR(256) NOT NULL,
                account_name VARCHAR(256) NOT NULL,
                category_primary VARCHAR(256),
                category_detailed VARCHAR(256),
                merchant_name VARCHAR(256),
                store_number INTEGER,
                logo_url VARCHAR(256),
                transaction_amount DECIMAL(10,2) NOT NULL,
                address VARCHAR(256),
                city VARCHAR(256),
                region VARCHAR(256),
                postal_code VARCHAR(256),
                country VARCHAR(256),
                datetime DATETIME,
                payment_channel VARCHAR(16),
                cursor VARCHAR(256),
                next_cursor VARCHAR(256),
                FOREIGN KEY (account_id) REFERENCES Accounts(account_id),
                FOREIGN KEY (account_name) REFERENCES Accounts(account_name)
            );
        """
    )

    conn.commit()

    return conn


def generate_data(num_accounts: int, num_transactions: int, filename: str) -> None:
    conn = init_db(filename)

    accounts: list[Account] = [Account() for _ in range(num_accounts)]

    for account in accounts:
        account.post(conn.cursor())
        conn.commit()

    for account in range(len(accounts)):
        transactions: list[Transactions] = [
            Transactions(accounts[account]) for _ in range(num_transactions)
        ]

        for transaction in transactions:
            transaction.post(conn.cursor())
            conn.commit()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""Input Generation Data""")
    # flags for reading input
    parser.add_argument("--a", help="num accounts")
    parser.add_argument("--t", help="num transactions per account")
    parser.add_argument("--f", help="filename of db")

    args = parser.parse_args()

    num_accounts: int = int(args.a) if args.a else 5
    num_transactions: int = int(args.t) if args.t else 5
    filename: str = f"../sql/{args.f if args.f else 'big.db'}"

    print(
        f"Generating {num_accounts} accounts with {num_transactions} transactions each"
    )

    generate_data(num_accounts, num_transactions, filename)

    print(f"Wrote to data {filename}")
