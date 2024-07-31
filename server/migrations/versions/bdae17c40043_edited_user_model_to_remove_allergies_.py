"""edited User model to remove allergies and add diet

Revision ID: bdae17c40043
Revises: e74e2b31d486
Create Date: 2024-07-30 14:10:08.666424

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bdae17c40043'
down_revision = 'e74e2b31d486'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('diet', sa.String(), nullable=True))
        batch_op.drop_column('allergies')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('allergies', sa.VARCHAR(), nullable=True))
        batch_op.drop_column('diet')

    # ### end Alembic commands ###