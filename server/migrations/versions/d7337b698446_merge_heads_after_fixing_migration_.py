"""Merge heads after fixing migration history

Revision ID: d7337b698446
Revises: 08f4bbb33b42, 80129da136be
Create Date: 2025-09-07 01:56:42.414559

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd7337b698446'
down_revision = ('08f4bbb33b42', '80129da136be')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
