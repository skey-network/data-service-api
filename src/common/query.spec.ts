import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model, model } from 'mongoose'
import { CommonIndexArgs } from './common.args'
import { indexQuery } from './query'
import config from '../config'

@Schema()
class TestEntity {
  @Prop()
  str: string

  @Prop()
  int: number

  @Prop()
  bool: boolean
}

type TestEntityDocument = TestEntity & Document
type TestEntityModel = Model<TestEntityDocument>

const testSchema = SchemaFactory.createForClass(TestEntity)
const testModel: TestEntityModel = model(TestEntity.name, testSchema)

const cases = [
  {
    toString: () => 'default args && no filter',
    given: {
      filterFields: [] as string[],
      args: new CommonIndexArgs()
    },
    expected: {
      find: {},
      sort: undefined,
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'filter by field',
    given: {
      filterFields: ['str'],
      args: { ...new CommonIndexArgs(), str: 'hello' }
    },
    expected: {
      find: { str: 'hello' },
      sort: undefined,
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'filter by multiple fields',
    given: {
      filterFields: ['str', 'int', 'bool'],
      args: { ...new CommonIndexArgs(), str: 'hello', int: 20, bool: true }
    },
    expected: {
      find: { str: 'hello', int: 20, bool: true },
      sort: undefined,
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'filter fields not whitelisted',
    given: {
      filterFields: [],
      args: { ...new CommonIndexArgs(), str: 'hello', int: 20, bool: true }
    },
    expected: {
      find: {},
      sort: undefined,
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'pagination',
    given: {
      filterFields: [] as string[],
      args: { ...new CommonIndexArgs(), take: 100, skip: 200 }
    },
    expected: {
      find: {},
      sort: undefined,
      skip: 200,
      limit: 100
    }
  },
  {
    toString: () => 'order by field',
    given: {
      filterFields: [] as string[],
      args: { ...new CommonIndexArgs(), orderBy: 'str' }
    },
    expected: {
      find: {},
      sort: { str: 'asc' },
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'descending order',
    given: {
      filterFields: [] as string[],
      args: { ...new CommonIndexArgs(), orderBy: 'int', order: 'desc' as 'desc' }
    },
    expected: {
      find: {},
      sort: { int: 'desc' },
      skip: 0,
      limit: config().app.defaultPaginationLimit
    }
  },
  {
    toString: () => 'all params specified',
    given: {
      filterFields: ['str', 'int', 'bool'] as string[],
      args: {
        str: 'aaa',
        int: 1000,
        bool: false,
        take: 1000,
        skip: 2000,
        order: 'desc' as 'desc',
        orderBy: 'bool'
      }
    },
    expected: {
      find: { str: 'aaa', int: 1000, bool: false },
      sort: { bool: 'desc' },
      skip: 2000,
      limit: 1000
    }
  }
]

describe('indexQuery', () => {
  const limit = jest.fn()
  const skip = jest.fn().mockReturnValue({ limit })
  const sort = jest.fn().mockReturnValue({ skip })
  const find = jest.spyOn(testModel, 'find').mockReturnValue({ sort } as any)

  it.each(cases)('%s', ({ given, expected }) => {
    indexQuery(testModel as any, given.filterFields, given.args)

    expect(limit.mock.calls[0][0]).toEqual(expected.limit)
    expect(skip.mock.calls[0][0]).toEqual(expected.skip)
    expect(sort.mock.calls[0][0]).toEqual(expected.sort)
    expect(find.mock.calls[0][0]).toEqual(expected.find)
  })

  afterEach(jest.clearAllMocks)
})
