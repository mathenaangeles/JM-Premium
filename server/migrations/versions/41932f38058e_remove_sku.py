"""Remove SKU

Revision ID: 41932f38058e
Revises: fdda36d3b170
Create Date: 2025-05-08 21:20:50.681494

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '41932f38058e'
down_revision = 'fdda36d3b170'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product_variants', schema=None) as batch_op:
        batch_op.drop_constraint('product_variants_sku_key', type_='unique')
        batch_op.drop_column('sku')

    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_constraint('products_sku_key', type_='unique')
        batch_op.drop_column('sku')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('sku', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.create_unique_constraint('products_sku_key', ['sku'])

    with op.batch_alter_table('product_variants', schema=None) as batch_op:
        batch_op.add_column(sa.Column('sku', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
        batch_op.create_unique_constraint('product_variants_sku_key', ['sku'])

    # ### end Alembic commands ###
