"""Remove obsolete meta_keywords from the product model

Revision ID: 70fb38c56e26
Revises: e991d3af8ebe
Create Date: 2025-05-10 03:21:13.873699

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '70fb38c56e26'
down_revision = 'e991d3af8ebe'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('meta_keywords')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('meta_keywords', sa.VARCHAR(length=255), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
